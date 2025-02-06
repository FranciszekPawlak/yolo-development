type Success = {
	error: null;
	data: string;
};
type Error = {
	error: string;
	data: null;
};
export type AiResult = Success | Error;
