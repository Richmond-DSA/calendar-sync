const ENTITIES: Record<string, string> = { nbsp: ' ', lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' };

// Google Calendar descriptions may be HTML (e.g. Zoom invites); Discord renders markdown, not HTML.
const htmlToMarkdown = (html: string): string => {
	if (!/<\/?[a-z][^>]*>/i.test(html)) return html;

	return html
		.replace(/\r?\n/g, ' ') // source newlines are insignificant in HTML
		.replace(/<a\b[^>]*href\s*=\s*["']([^"']*)["'][^>]*>(.*?)<\/a>/gis, (_, href: string, inner: string) => {
			const text = inner.replace(/<[^>]+>/g, '').trim();
			return !text || text === href ? href : `[${text}](${href})`;
		})
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/(p|div|h[1-6]|ul|ol)>/gi, '\n')
		.replace(/<li\b[^>]*>/gi, '\n- ')
		.replace(/<\/?(b|strong)\b[^>]*>/gi, '**')
		.replace(/<\/?(i|em)\b[^>]*>/gi, '*')
		.replace(/<\/?u\b[^>]*>/gi, '__')
		.replace(/<\/?[a-z][^>]*>/gi, '')
		.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
			if (code[0] === '#') {
				const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
				return String.fromCodePoint(n);
			}
			return ENTITIES[code.toLowerCase()] ?? match;
		})
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
};

export default htmlToMarkdown;
