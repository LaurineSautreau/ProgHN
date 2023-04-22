let text_tokens = [];
let text_lines = [];


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

                if (text_tokens.length != 0) {
                    document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès, ' + text_tokens.length + ' tokens dans le texte et ' + text_lines.length + ' lignes non vides.</span>';
                }
            }

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            text_tokens = [];
            text_lines = [];
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
    
    if (delim === "") {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Aucun délimiteur donné !</span>'
        return;
    }

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
    
    text_lines = text.split(new RegExp("[\\r\\n]+")).filter(x => x.trim() != '');

    // global_var_tokens = tokens; // décommenter pour vérifier l'état des tokens dans la console développeurs sur le navigateur
    // display.innerHTML = tokens.join(" ");
}



// Fonction bouton dictionnaire 

function dictionnaire() {
    let comptes = new Map();
    let display = document.getElementById("page-analysis");

    if (text_tokens.length === 0) {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

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

    display.innerHTML = "";
    display.appendChild(table);
    document.getElementById("logger").innerHTML = '';
}


// Fonction bouton grep 

function grep() {
    let pole = document.getElementById("poleID").value.trim();
    let display = document.getElementById("page-analysis");
    
    if (text_lines.length === 0) {
        // pas de lignes: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    if (pole === '') {
        // pas de pôle: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Le pôle n\'est pas renseigné !</span>';
        return;
    }
    let pole_regex = new RegExp('(' + pole + ')', "g");

    display.innerHTML = "";
    for (let line of text_lines) {
        if (line.search(pole_regex) != -1) {
            let paragraph = document.createElement("p");
            paragraph.innerHTML = line.replaceAll(pole_regex, '<span style="color:red;">$1</span>')
            display.appendChild(paragraph);
        }
    }
}

// Fonction bouton concordancier 

function concordancier() {
    let pole = document.getElementById("poleID").value.trim();
    let display = document.getElementById("page-analysis");
    
    if (text_tokens.length === 0) {
        // pas de lignes: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    if (pole === '') {
        // pas de pôle: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Le pôle n\'est pas renseigné !</span>';
        return;
    }

    let pole_regex = new RegExp("^" + pole + "$", "g");
    let tailleContexte = Number(document.getElementById('lgID').value ?? "10");

    let table = document.createElement("table");
    table.style.margin = "auto";
    let entete = table.appendChild(document.createElement("tr"));
    entete.innerHTML = "<th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th>";

    display.innerHTML = "";
    for (let i=0; i < text_tokens.length; i++) {
        if (text_tokens[i].search(pole_regex) != -1) {
            let start = Math.max(i - tailleContexte, 0);
            let end = Math.min(i + tailleContexte, text_tokens.length);
            let lc = text_tokens.slice(start, i);
            let rc = text_tokens.slice(i+1, end+1);
            let row = document.createElement("tr");

            // manière fainéante
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = lc.join(' ');
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = text_tokens[i];
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = rc.join(' ');
            table.appendChild(row);
        }
    }
    
    display.innerHTML = "";
    display.appendChild(table);
}


// Fonction mot le plus long

function long() {
	// Chargé le texte 
    let text = document.getElementById("fileDisplayArea").innerText;
    let texteoriginal = text.split(/[\n\s,.;']+/);
    let motlong="";
        for (i=0; i<texteoriginal.length;i++) {
            if (texteoriginal[i].length>motlong.length)
            {motlong=texteoriginal[i]} }
        // On affiche le résultat
        document.getElementById('page-analysis').innerHTML = "Le mot le plus long est « <u>"+motlong+"</u> ».";
        
}


// Fonction texte à l'envers 

function renversé(){
    // Chargé le texte
    let text = document.getElementById('fileDisplayArea').innerText;
    const newStr = text.split("").reverse().join("");
        // On affiche le résultat 
    document.getElementById('page-analysis').innerHTML= newStr;
        
}

// Fonction graphique en barres  

function graphiqueBarres() {
    let data = {
        labels: ["a", "b", "c", "d"],
        series: [[1, 2, 3, 4,]] // notez les doubles parenthèses comparé à Camembert : on peut gérer plusieurs séries de chiffres (plusieurs barres à chaque label)
    };

    let options = {
        width: 800,
        height: 450,
        horizontalBars: true
    };

    document.getElementById('page-analysis').innerHTML = '';
    new Chartist.Bar("#page-analysis", data, options);
}
