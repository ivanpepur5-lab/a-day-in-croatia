/**
 * Destination photography — all from Wikimedia Commons, by named photographers,
 * under licences that allow reuse with attribution (CC BY / CC BY-SA) or none
 * (CC0 / public domain). Files were resized for the web (changes: resized,
 * metadata stripped; displayed cropped). Attribution is shown in-app on each
 * photo, in the Photo credits sheet, and in docs/PHOTO_CREDITS.md.
 *
 * Licence/author fields were read from each file's Commons page on 2026-11-23.
 */
export const PHOTOS = {
  'split-hero': {
    src: '/images/photos/split-hero-1200.jpg',
    thumb: '/images/photos/split-hero-480.jpg',
    large: '/images/photos/split-hero-1920.jpg',
    alt: "Split waterfront (Riva) with Diocletian’s Palace and the bell tower of St Domnius",
    title: "View_of_Diocletian's_Palace,_Split_01.jpg",
    author: "Bernard Gagnon",
    license: 'CC BY-SA 4.0',
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Diocletian's_Palace,_Split_01.jpg",
    originalSize: '4429×2953',
    qualityImage: true,
  },
  'diocletians-palace': {
    src: '/images/photos/diocletians-palace-1200.jpg',
    thumb: '/images/photos/diocletians-palace-480.jpg',
    alt: "The Peristyle of Diocletian’s Palace with the Protiron, Split",
    title: "Split_BW_2024-10-02_11-16-50.jpg",
    author: "Berthold Werner",
    license: 'CC BY-SA 4.0',
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Split_BW_2024-10-02_11-16-50.jpg",
    originalSize: '3651×5492',
    qualityImage: true,
  },
  'marjan': {
    src: '/images/photos/marjan-1200.jpg',
    thumb: '/images/photos/marjan-480.jpg',
    alt: "View over Split and its harbour from the pine-covered Marjan hill",
    title: "Split-Marjan-01.jpg",
    author: "SchiDD",
    license: 'CC BY-SA 4.0',
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Split-Marjan-01.jpg",
    originalSize: '5237×2228',
    qualityImage: false,
  },
  'bacvice': {
    src: '/images/photos/bacvice-1200.jpg',
    thumb: '/images/photos/bacvice-480.jpg',
    alt: "Aerial view of Bačvice beach, Split",
    title: "Bacvice_Beach_in_Split,_Croatia_(48608741537).jpg",
    author: "dronepicr",
    license: 'CC BY 2.0',
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bacvice_Beach_in_Split,_Croatia_(48608741537).jpg",
    originalSize: '5464×3640',
    qualityImage: false,
  },
  'salona': {
    src: '/images/photos/salona-1200.jpg',
    thumb: '/images/photos/salona-480.jpg',
    alt: "Amphitheatre of Salona, Solin",
    title: "Amphitheatre_of_Salona_02.jpg",
    author: "Bernard Gagnon",
    license: 'CC BY-SA 4.0',
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Amphitheatre_of_Salona_02.jpg",
    originalSize: '4576×2774',
    qualityImage: true,
  },
  'klis': {
    src: '/images/photos/klis-1200.jpg',
    thumb: '/images/photos/klis-480.jpg',
    alt: "Klis Fortress",
    title: "Fortress_of_Klis_05.jpg",
    author: "Bernard Gagnon",
    license: 'CC BY-SA 4.0',
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Fortress_of_Klis_05.jpg",
    originalSize: '4839×3226',
    qualityImage: true,
  },
  'trogir': {
    src: '/images/photos/trogir-1200.jpg',
    thumb: '/images/photos/trogir-480.jpg',
    alt: "Trogir old town and waterfront",
    title: "Trogir_Panorama_01.jpg",
    author: "Helmlechner",
    license: 'CC0',
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Trogir_Panorama_01.jpg",
    originalSize: '8422×4737',
    qualityImage: false,
  },
  'omis': {
    src: '/images/photos/omis-1200.jpg',
    thumb: '/images/photos/omis-480.jpg',
    alt: "Cetina river canyon at Omiš",
    title: "Cetina-Canyon_in_Omis,_Croatia.JPG",
    author: "Modzzak",
    license: 'Public domain',
    licenseUrl: null,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cetina-Canyon_in_Omis,_Croatia.JPG",
    originalSize: '2816×2112',
    qualityImage: false,
  },
  'krka': {
    src: '/images/photos/krka-1200.jpg',
    thumb: '/images/photos/krka-480.jpg',
    alt: "Skradinski buk waterfall, Krka National Park",
    title: "Skradinski_buk_waterfall_–_NP_Krka_–_2016.jpg",
    author: "Skot",
    license: 'CC BY-SA 4.0',
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Skradinski_buk_waterfall_–_NP_Krka_–_2016.jpg",
    originalSize: '4896×3264',
    qualityImage: true,
  },
};

/** WebP sibling of a JPEG path (all photos ship in both formats). */
export const webpOf = (src) => src.replace(/\.jpg$/, '.webp');

/** Short attribution line, e.g. "Photo: Bernard Gagnon · CC BY-SA 4.0". */
export function creditLine(photo) {
  return `Photo: ${photo.author} · ${photo.license}`;
}
