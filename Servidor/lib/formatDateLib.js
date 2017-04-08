//Função que formata e retorna data e hora
module.exports = function formatDate(today) {

	dd = today.getDate(),
	MM = today.getMonth() + 1,
	yyyy = today.getFullYear();
	hh = today.getHours();
	mm = today.getMinutes();
	ss = today.getSeconds();
		
	if (MM < 10) MM = '0' + MM;
	if (dd < 10) dd = '0' + dd;
	if (hh < 10) hh = '0' + hh;
	if (mm < 10) mm = '0' + mm;
	if (ss < 10) ss = '0' + ss;
		
	today.date = `${yyyy}-${MM}-${dd}`;
	today.time = `${hh}:${mm}:${ss}`;
	return today;
}