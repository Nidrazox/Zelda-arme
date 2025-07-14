
// Stocker les armes dans le localStorage
let weapons = JSON.parse(localStorage.getItem('weapons')) || [];

// Fonction pour sauvegarder les armes
function saveWeapons() {
    localStorage.setItem('weapons', JSON.stringify(weapons));
}

// Fonction pour afficher les armes
function displayWeapons() {
    const weaponsList = document.getElementById('weapons-list');
    weaponsList.innerHTML = '';

    if (weapons.length === 0) {
        weaponsList.innerHTML = '<p>Aucune arme ajoutée pour le moment.</p>';
        return;
    }

    weapons.forEach((weapon, index) => {
        const weaponCard = document.createElement('div');
        weaponCard.className = 'weapon-card';

        const imageUrl = weapon.imageUrl || 'https://via.placeholder.com/300x200?text=Pas+d%27image';

        weaponCard.innerHTML = \`
            <img src="\${imageUrl}" alt="\${weapon.name}" class="weapon-image">
            <div class="weapon-details">
                <div class="weapon-name">\${weapon.name}</div>
                <div class="weapon-stats">
                    <div class="weapon-stat">
                        <span>Durabilité:</span>
                        <span>\${weapon.durability}/100</span>
                    </div>
                    <div class="weapon-stat">
                        <span>Rareté:</span>
                        <span class="rarity-\${weapon.rarity}">\${weapon.rarity.charAt(0).toUpperCase() + weapon.rarity.slice(1)}</span>
                    </div>
                    <div class="weapon-stat">
                        <span>Dégâts:</span>
                        <span>\${weapon.damage}</span>
                    </div>
                    <div class="weapon-stat">
                        <span>Distance:</span>
                        <span>\${weapon.range} m</span>
                    </div>
                </div>
                <div class="weapon-actions">
                    <button class="btn-edit" onclick="editWeapon(\${index})">Modifier</button>
                    <button class="btn-delete" onclick="deleteWeapon(\${index})">Supprimer</button>
                </div>
            </div>
        \`;

        weaponsList.appendChild(weaponCard);
    });
}

// Ajouter une nouvelle arme
document.getElementById('weapon-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const durability = parseInt(document.getElementById('durability').value);
    const rarity = document.getElementById('rarity').value;
    const damage = parseInt(document.getElementById('damage').value);
    const range = parseInt(document.getElementById('range').value);

    let imageUrl = document.getElementById('image-url').value;

    const imageFile = document.getElementById('image-file').files[0];
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    const newWeapon = {
        name,
        imageUrl,
        durability,
        rarity,
        damage,
        range
    };

    weapons.push(newWeapon);
    saveWeapons();
    displayWeapons();
    document.getElementById('weapon-form').reset();
});

// Supprimer une arme
function deleteWeapon(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette arme?')) {
        weapons.splice(index, 1);
        saveWeapons();
        displayWeapons();
    }
}

// Modifier une arme
function editWeapon(index) {
    const weapon = weapons[index];

    document.getElementById('name').value = weapon.name;
    document.getElementById('image-url').value = weapon.imageUrl || '';
    document.getElementById('durability').value = weapon.durability;
    document.getElementById('rarity').value = weapon.rarity;
    document.getElementById('damage').value = weapon.damage;
    document.getElementById('range').value = weapon.range;

    const submitButton = document.querySelector('.btn-add');
    submitButton.textContent = 'Modifier l'arme';
    submitButton.dataset.editIndex = index;

    document.getElementById('weapon-form').onsubmit = function (e) {
        e.preventDefault();
        const editIndex = parseInt(submitButton.dataset.editIndex);

        const name = document.getElementById('name').value;
        const durability = parseInt(document.getElementById('durability').value);
        const rarity = document.getElementById('rarity').value;
        const damage = parseInt(document.getElementById('damage').value);
        const range = parseInt(document.getElementById('range').value);
        let imageUrl = document.getElementById('image-url').value;

        const imageFile = document.getElementById('image-file').files[0];
        if (imageFile) {
            imageUrl = URL.createObjectURL(imageFile);
        }

        weapons[editIndex] = {
            name,
            imageUrl: imageUrl || weapons[editIndex].imageUrl,
            durability,
            rarity,
            damage,
            range
        };

        saveWeapons();
        displayWeapons();
        document.getElementById('weapon-form').reset();
        submitButton.textContent = 'Ajouter l'arme';
        delete submitButton.dataset.editIndex;

        document.getElementById('weapon-form').onsubmit = null;
        document.getElementById('weapon-form').addEventListener('submit', arguments.callee.caller);
    };
}

// Chargement initial
window.onload = function () {
    displayWeapons();
};
