function exercice1() {
	const mon_tableau = [ "rouge", "vert", "orange" ]; 
	mon_tableau.pop();
	document.getElementById("exercice1Resultat").innerHTML = mon_tableau; 
	mon_tableau.unshift("orange");
	document.getElementById("exercice1Resultat").innerHTML = mon_tableau; 
		
}


function exercice2() {
	const mon_tableau = document.getElementById("texteExercice2").value;
	mon_tableau.join(" ");
	document.getElementById("exercice2Resultat").innerHTML = mon_tableau;
	mon_tableau.toUpperCase();
	document.getElementById("exercice2Resultat").innerHTML = mon_tableau;
		
}

function exercice3() {
	const mon_tableau = document.getElementById("texteExercice3").value;
	mon_tableau.join(" ");
	document.getElementById("exercice3Resultat").innerHTML = mon_tableau;
	mon_tableau.substr(0,3);
	document.getElementById("exercice3Resultat").innerHTML = mon_tableau;
}


function exercice4() {
	const mon_tableau = document.getElementById("texteExercice4").value;
	mon_tableau.join(" ");
	document.getElementById("exercice4Resultat").innerHTML = mon_tableau;
	mon_tableau.forEach();
	document.getElementById("exercice4Resultat").innerHTML = mon_tableau;	
	
}

//j'ai eu des difficultés avec .join() car lorsque je mettais toString() et que je lancais le code, la phrase s'affiche hors avec .join() n'a ne me l'affiche plus. 
// C'est pour cela que à partir de mon exercice 2 rien ne s'affiche en résultat. De plus, je n'y arrive pas mais je vous ai quand même donné le code que j'ai fait pour essayer de trouver. 
