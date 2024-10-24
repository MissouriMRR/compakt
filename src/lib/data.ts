// Taken from https://gist.github.com/changhuixu/de092ee55a9e115abba988910bd68d41
export class CsvDataService {
	/**
	 * @description
	 * Exports a key-value object to a csv file format
	 * @param {string} filename The object to parse and export
	 * @param {object[]} rows The filename of the exported file
	*/
	static exportToCsv(filename: string, rows: object[], excluded: string[] = []) {
		if (!rows || !rows.length) {
			return;
		}
		const separator = ',';
		const keys = Object.keys(rows[0]).filter(k => !excluded.includes(k));
		const csvContent =
			keys.join(separator) +
			'\n' +
			rows
				.map((row) => {
					return keys
						.map((k) => {
							let cell = row[k] === null || row[k] === undefined ? '' : row[k];
							cell =
								cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
							if (cell.search(/("|,|\n)/g) >= 0) {
								cell = `"${cell}"`;
							}
							return cell;
						})
						.join(separator);
				})
				.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, filename);
		} else {
			const link = document.createElement('a');
			if (link.download !== undefined) {
				// Browsers that support HTML5 download attribute
				const url = URL.createObjectURL(blob);
				link.setAttribute('href', url);
				link.setAttribute('download', filename);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}
}
