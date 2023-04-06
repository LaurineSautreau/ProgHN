let text_tokens = [];


window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    // On "écoute" si le fichier donné a été modifié.
    // Si on a donné un nouveau fichier, on essaie de le lire.
    fileInput.addEventListener('change', function(e) {
        // Dans le HTML (ligne 22), fileInput est un élément de tag "input" avec un attribut type="file".
        // On peut récupérer les fichiers données avec le champs ".files" au niveau du javascript.
        // On peut potentiellement donner plusieurs fichiers,
        // mais ici on n'en lit qu'un seul, le premier, donc indice 0.
        let file = fileInput.files[0];
        // on utilise cette expression régulière pour vérifier qu'on a bien un fichier texte.
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { // on vérifie qu'on a bien un fichier texte
            // lecture du fichier. D'abord, on crée un objet qui sait lire un fichier.
            var reader = new FileReader();

            // on dit au lecteur de fichier de placer le résultat de la lecture
            // dans la zone d'affichage du texte.
            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
                segmentation();
                document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès, ' + text_tokens.length + ' tokens dans le texte.</span>';
            }

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
}
// Fonction bouton aide 	

function afficheCacheAide() {
    let aide = document.getElementById("texteaide");
    let boutonAide = document.getElementById("boutonAide");
    let display = texteaide.style.display;
    
    if (display === "none") {
        aide.style.display = "block";
        boutonAide.innerText = "Cacher l'aide";
    } else {
        aide.style.display = "none";
        boutonAide.innerText = "Afficher l'aide";
    }
}

// Fonction bouton segmentation

function segmentation() {
    let text = document.getElementById("fileDisplayArea").innerText;
    let delim = document.getElementById("delimID").value;
    let display = document.getElementById("page-analysis");

    let regex_delim = new RegExp(
        "["
        + delim
            .replace("-", "\\-") // le tiret n'est pas à la fin : il faut l'échapper, sinon erreur sur l'expression régulière
            .replace("[", "\\[").replace("]", "\\]") // à changer sinon regex fautive, exemple : [()[]{}] doit être [()\[\]{}], on doit "échapper" les crochets, sinon on a un symbole ] qui arrive trop tôt.
        + "\\s" // on ajoute tous les symboles d'espacement (retour à la ligne, etc)
        + "]+" // on ajoute le + au cas où plusieurs délimiteurs sont présents : évite les tokens vides
    );

    let tokens_tmp = text.split(regex_delim);
    text_tokens = tokens_tmp.filter(x => x.trim() != ''); // on s'assure de ne garder que des tokens "non vides"

    // global_var_tokens = tokens; // décommenter pour vérifier l'état des tokens dans la console développeurs sur le navigateur
    // display.innerHTML = tokens.join(" ");
	
	let ligne = text.split("\n");// segmentation en lignes 
	text_ligne = ligne.filter(x => x.trim() != ''); // nombre de lignes non vides 
	let autre = text.split(ligne,"\n","g") 	// stocker dans une variable gloable les lignes du texte 
	messagelignesnonvides ='<span style=" background:red;">Nombre de lignes non vides</span>';
	document.getElementById("fileDisplayArea").innerHTML = messagelignesnonvides;

}

// Fonction bouton dictionnaire 

function dictionnaire() {
    let comptes = new Map();
    let display = document.getElementById("page-analysis");

    for (let token of text_tokens) {
        comptes.set(token, (comptes.get(token) ?? 0) + 1);
    }
    
    let comptes_liste = Array.from(comptes);
    comptes_liste = comptes_liste.sort(function(a, b) {
        // solution attendue
        return b[1] - a[1]; // tri numérique inversé


    });

    let table = document.createElement("table");
    table.style.margin = "auto";
    let entete = table.appendChild(document.createElement("tr"));
    entete.innerHTML = "<th>mot</th><th>compte</th>";
    
    for (let [mot, compte] of comptes_liste) {
        let ligne_element = table.appendChild(document.createElement("tr"));
        let cellule_mot = ligne_element.appendChild(document.createElement("td"));
        let cellule_compte = ligne_element.appendChild(document.createElement("td"));
        cellule_mot.innerHTML = mot;
        cellule_compte.innerHTML = compte;
    }

    display.appendChild(table);
	
	
	messagederreur ='<span style=" background:red;">Aucun fichier chargé</span>';
	document.getElementById("fileDisplayArea").innerHTML = messagederreur;
  
}



// Fonction bouton grep 

function grep() {
	
	let text = document.getElementById("fileDisplayArea").innerText;
    let poleID = document.getElementById("poleID").value;
    let display = document.getElementById("page-analysis");
	
	let ligne = document.getElementById('fileDisplayArea').innerText;
	let ligne = new RegExp("\\w+", "g");

	
	
	messagederreur ='<span style=" background:red;">Aucun pôle chargé</span>';
	document.getElementById("fileDisplayArea").innerHTML = messagederreur;
}