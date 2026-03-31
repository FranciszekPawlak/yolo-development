import { createHash } from "node:crypto";
import { Readable } from "node:stream";
import { google } from "googleapis";

const FOLDER_NAME = process.env.DRIVE_FOLDER_NAME || "ExpenseAnalyzer";
const RAW_FOLDER_NAME = "raw";
const MASTER_FILENAME = "master.json";

function getDriveClient(accessToken: string) {
	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });
	return google.drive({ version: "v3", auth });
}

async function findOrCreateFolder(
	drive: ReturnType<typeof google.drive>,
	name: string,
	parentId?: string,
): Promise<string> {
	const query = [
		`name='${name}'`,
		"mimeType='application/vnd.google-apps.folder'",
		"trashed=false",
		parentId ? `'${parentId}' in parents` : undefined,
	]
		.filter(Boolean)
		.join(" and ");

	const list = await drive.files.list({ q: query, fields: "files(id)" });
	const existing = list.data.files?.[0];
	if (existing?.id) return existing.id;

	const created = await drive.files.create({
		requestBody: {
			name,
			mimeType: "application/vnd.google-apps.folder",
			...(parentId ? { parents: [parentId] } : {}),
		},
		fields: "id",
	});

	if (!created.data.id) throw new Error("Failed to create Drive folder");
	return created.data.id;
}

/** Ensures ExpenseAnalyzer/ and ExpenseAnalyzer/raw/ folders exist on Drive. */
export async function ensureFolders(accessToken: string) {
	const drive = getDriveClient(accessToken);
	const rootId = await findOrCreateFolder(drive, FOLDER_NAME);
	const rawId = await findOrCreateFolder(drive, RAW_FOLDER_NAME, rootId);
	return { drive, rootId, rawId };
}

/**
 * Upload a raw file to the raw/ folder on Drive.
 * Skips upload if a file with the same MD5 checksum already exists in raw/.
 * Returns true if uploaded, false if duplicate was skipped.
 */
export async function uploadRawFile(
	accessToken: string,
	fileName: string,
	content: Buffer,
): Promise<boolean> {
	const { drive, rawId } = await ensureFolders(accessToken);

	const localMd5 = createHash("md5").update(content).digest("hex");

	const existing = await drive.files.list({
		q: `'${rawId}' in parents and trashed=false`,
		fields: "files(id, md5Checksum)",
		pageSize: 1000,
	});

	const isDuplicate = existing.data.files?.some(
		(f) => f.md5Checksum === localMd5,
	);
	if (isDuplicate) return false;

	await drive.files.create({
		requestBody: {
			name: fileName,
			parents: [rawId],
		},
		media: {
			mimeType: "text/csv",
			body: Readable.from(content),
		},
	});

	return true;
}

export interface DriveFileInfo {
	id: string;
	name: string;
	size: string;
	createdTime: string;
	modifiedTime: string;
}

/** List all files in the raw/ subfolder, sorted by creation date descending. */
export async function listRawFiles(
	accessToken: string,
): Promise<DriveFileInfo[]> {
	const { drive, rawId } = await ensureFolders(accessToken);

	const allFiles: DriveFileInfo[] = [];
	let pageToken: string | undefined;

	do {
		const res = await drive.files.list({
			q: `'${rawId}' in parents and trashed=false`,
			fields: "nextPageToken, files(id, name, size, createdTime, modifiedTime)",
			orderBy: "createdTime desc",
			pageSize: 100,
			pageToken,
		});

		for (const f of res.data.files ?? []) {
			allFiles.push({
				id: f.id!,
				name: f.name!,
				size: f.size ?? "0",
				createdTime: f.createdTime!,
				modifiedTime: f.modifiedTime!,
			});
		}

		pageToken = res.data.nextPageToken ?? undefined;
	} while (pageToken);

	return allFiles;
}

/** Download a file's content from Drive as a Buffer. */
export async function downloadFile(
	accessToken: string,
	fileId: string,
): Promise<{ name: string; buffer: Buffer }> {
	const drive = getDriveClient(accessToken);

	const meta = await drive.files.get({ fileId, fields: "name" });
	const response = await drive.files.get(
		{ fileId, alt: "media" },
		{ responseType: "arraybuffer" },
	);

	return {
		name: meta.data.name!,
		buffer: Buffer.from(response.data as ArrayBuffer),
	};
}

/** Find master.json file ID in the root folder, or null if it doesn't exist. */
async function findMasterFileId(
	drive: ReturnType<typeof google.drive>,
	rootId: string,
): Promise<string | null> {
	const list = await drive.files.list({
		q: `name='${MASTER_FILENAME}' and '${rootId}' in parents and trashed=false`,
		fields: "files(id)",
	});
	return list.data.files?.[0]?.id ?? null;
}

/** Load master.json from Drive. Returns null if it doesn't exist yet. */
export async function loadMasterFile(accessToken: string) {
	const { drive, rootId } = await ensureFolders(accessToken);
	const fileId = await findMasterFileId(drive, rootId);
	if (!fileId) return null;

	const response = await drive.files.get(
		{ fileId, alt: "media" },
		{ responseType: "text" },
	);

	return JSON.parse(response.data as string);
}

/** Save (create or update) master.json on Drive. */
export async function saveMasterFile(accessToken: string, data: unknown) {
	const { drive, rootId } = await ensureFolders(accessToken);
	const fileId = await findMasterFileId(drive, rootId);
	const body = Readable.from(JSON.stringify(data));
	const media = { mimeType: "application/json", body };

	if (fileId) {
		await drive.files.update({ fileId, media });
	} else {
		await drive.files.create({
			requestBody: {
				name: MASTER_FILENAME,
				parents: [rootId],
			},
			media,
		});
	}
}
