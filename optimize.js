const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inDir = path.join(__dirname, 'Assets');
const files = fs.readdirSync(inDir);

files.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
        const filePath = path.join(inDir, file);
        const outPath = path.join(inDir, file.replace(/\.(png|jpg)$/i, '.webp'));

        let transform = sharp(filePath);

        // Scale down huge hero images to 1920 or 1080 without quality loss
        if (file.includes('Hero')) {
            if (file.includes('DM')) {
                transform = transform.resize({ width: 1080, withoutEnlargement: true });
            } else {
                transform = transform.resize({ width: 1920, withoutEnlargement: true });
            }
        } else if (file.includes('Perfil')) {
            transform = transform.resize({ width: 800, withoutEnlargement: true });
        }

        transform.webp({ quality: 85, effort: 6 })
            .toFile(outPath)
            .then(() => console.log('Optimized:', outPath))
            .catch(err => console.error('Error optimizing:', file, err));
    }
});
