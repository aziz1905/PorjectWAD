const categories = [
    { id: 1, name: 'Princess', icon: 'mdi:crown-outline' },
    { id: 2, name: 'Superhero', icon: 'game-icons:bat-mask' },
    { id: 3, name: 'Horor', icon: 'mdi:ghost-outline' },
    { id: 4, name: 'Tradisional', icon: 'mdi:drama-masks' },
    { id: 5, name: 'Profesi', icon: 'mdi:briefcase-outline' },
    { id: 6, name: 'Hewan', icon: 'mdi:dog' },
    { id: 7, name: 'Fantasi', icon: 'mdi:magic-staff' },
    { id: 8, name: 'Anime', icon: 'mdi:pokeball' }
];

export const getAllCategories = (req, res) => {
    res.status(200).json(categories);
};
