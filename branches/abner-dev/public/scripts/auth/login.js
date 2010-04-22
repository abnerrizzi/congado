function checkData() {
	var f1 = document.forms[0];
	var wm = "Caro usu\u00E1rio,\nPor favor digite os seguintes dados:\n\r\n";
	var noerror = 1;

	// --- entered_login ---
	var t1 = f1.username;
	if (t1.value == "" || t1.value == " ") {
		wm += "Login\r\n";
		noerror = 0;
	}

	// --- entered_password ---
	var t1 = f1.password;
	if (t1.value == "" || t1.value == " ") {
		wm += "Senha\r\n";
		noerror = 0;
	}

	if (noerror == 0) {
		alert(wm);
		return false;
	} else {
		return true;
	}
}