export function normalizeSearchParams(raw: { [key: string]: string | string[] | undefined }): Record<string, string> {
	return Object.entries(raw).reduce((acc, [key, value]) => {
		if (typeof value === "string") {
			acc[key] = value;
		} else if (Array.isArray(value)) {
			acc[key] = value[0]; // 필요 시 join(",")도 가능
		}
		return acc;
	}, {} as Record<string, string>);
}

export function toURLSearchParams(raw: { [key: string]: string | string[] | undefined }): URLSearchParams {
	return new URLSearchParams(normalizeSearchParams(raw));
}
