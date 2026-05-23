/* =============================================
   LUXE THREADS - Product Data Store
   ============================================= */

const LuxeData = {
  products: [
    {
      id: 1, name: "Classic Oxford Button-Down", category: "office",
      subcategory: "Shirts", price: 4800, originalPrice: 6200, discount: 23,
      badge: "sale",
      sizes: ["XS","S","M","L","XL","XXL","3XL"],
      outOfStock: ["XS"],
      colors: [{name:"White",code:"#FFFFFF"},{name:"Sky Blue",code:"#87CEEB"},{name:"Light Grey",code:"#D3D3D3"}],
      images: [
        "https://placehold.co/600x800/e8e8e8/555555?text=Oxford+Shirt+1",
        "https://placehold.co/600x800/e8e8e8/555555?text=Oxford+Shirt+2",
        "https://placehold.co/600x800/e8e8e8/555555?text=Oxford+Shirt+3"
      ],
      rating: 4.7, reviewCount: 128,
      description: "Crafted from premium 100% Egyptian cotton, this classic Oxford button-down brings timeless elegance to your office wardrobe. The slightly fitted cut and fine stitching make it ideal for both boardroom meetings and casual Fridays.",
      material: "100% Egyptian Cotton", care: "Machine wash 30°C",
      isNew: false, isFeatured: true,
      reviews: [
        { id:1, user:"Dilshan P.", rating:5, date:"2026-04-12", text:"Perfect fit and great fabric quality. Wears well even after multiple washes.", verified:true, helpful:24 },
        { id:2, user:"Nirmala K.", rating:4, date:"2026-03-28", text:"Beautiful shirt, exactly as described. Collar stays crisp all day.", verified:true, helpful:15 }
      ]
    },
    {
      id: 2, name: "Urban Slim Chinos", category: "office",
      subcategory: "Trousers", price: 5500, originalPrice: 5500, discount: 0,
      badge: "new",
      sizes: ["28","30","32","34","36","38"],
      outOfStock: [],
      colors: [{name:"Navy",code:"#1a1a2e"},{name:"Khaki",code:"#C3B091"},{name:"Olive",code:"#6B7C3B"}],
      images: [
        "https://placehold.co/600x800/c3b091/ffffff?text=Slim+Chinos+1",
        "https://placehold.co/600x800/c3b091/ffffff?text=Slim+Chinos+2"
      ],
      rating: 4.5, reviewCount: 89,
      description: "These Urban Slim Chinos combine a modern slim fit with all-day comfort. Wrinkle-resistant fabric keeps you sharp from morning meetings to evening events. Features a clean front and invisible back pocket design.",
      material: "98% Cotton 2% Elastane", care: "Machine wash 40°C",
      isNew: true, isFeatured: true,
      reviews: [
        { id:1, user:"Kasun F.", rating:5, date:"2026-05-02", text:"Fantastic chinos. Very comfortable and looks premium.", verified:true, helpful:18 }
      ]
    },
    {
      id: 3, name: "Signature Blazer", category: "office",
      subcategory: "Jackets", price: 14500, originalPrice: 18000, discount: 19,
      badge: "sale",
      sizes: ["XS","S","M","L","XL","XXL"],
      outOfStock: ["XS"],
      colors: [{name:"Charcoal",code:"#36454F"},{name:"Navy",code:"#1a1a2e"},{name:"Camel",code:"#C19A6B"}],
      images: [
        "https://placehold.co/600x800/36454f/ffffff?text=Signature+Blazer+1",
        "https://placehold.co/600x800/36454f/ffffff?text=Signature+Blazer+2"
      ],
      rating: 4.8, reviewCount: 64,
      description: "Make a powerful statement with our Signature Blazer. Tailored from a premium wool-blend fabric, it drapes beautifully and holds its shape throughout the day. The notched lapel and single-button closure add modern sophistication.",
      material: "65% Wool 35% Polyester", care: "Dry clean only",
      isNew: false, isFeatured: true,
      reviews: [
        { id:1, user:"Ayasha M.", rating:5, date:"2026-04-25", text:"Absolutely stunning blazer. Got so many compliments at work.", verified:true, helpful:31 }
      ]
    },
    {
      id: 4, name: "Essential Crew-Neck Tee", category: "casual",
      subcategory: "T-Shirts", price: 1800, originalPrice: 2200, discount: 18,
      badge: "sale",
      sizes: ["XS","S","M","L","XL","XXL","3XL"],
      outOfStock: [],
      colors: [{name:"White",code:"#FFFFFF"},{name:"Black",code:"#1a1a1a"},{name:"Sage Green",code:"#87A96B"},{name:"Blush",code:"#FFB6C1"}],
      images: [
        "https://placehold.co/600x800/1a1a1a/ffffff?text=Crew+Tee+1",
        "https://placehold.co/600x800/1a1a1a/ffffff?text=Crew+Tee+2"
      ],
      rating: 4.6, reviewCount: 312,
      description: "Our bestselling Essential Crew-Neck Tee is made from 180gsm combed cotton for that perfect weight — not too thin, not too heavy. The relaxed fit is versatile enough for any casual occasion.",
      material: "100% Combed Cotton", care: "Machine wash 30°C",
      isNew: false, isFeatured: true,
      reviews: [
        { id:1, user:"Thilini B.", rating:5, date:"2026-05-10", text:"Best basic tee I've ever bought. Washes great and keeps its shape.", verified:true, helpful:42 },
        { id:2, user:"Roshan W.", rating:4, date:"2026-04-20", text:"Good quality for the price. Runs a tiny bit small, size up.", verified:true, helpful:28 }
      ]
    },
    {
      id: 5, name: "Relaxed Linen Shirt", category: "casual",
      subcategory: "Shirts", price: 3200, originalPrice: 3200, discount: 0,
      badge: "hot",
      sizes: ["S","M","L","XL","XXL"],
      outOfStock: [],
      colors: [{name:"Natural",code:"#F5F0E8"},{name:"Terracotta",code:"#C66B3D"},{name:"Denim Blue",code:"#5B7FA6"}],
      images: [
        "https://placehold.co/600x800/f5f0e8/555555?text=Linen+Shirt+1",
        "https://placehold.co/600x800/f5f0e8/555555?text=Linen+Shirt+2"
      ],
      rating: 4.7, reviewCount: 176,
      description: "Embrace effortless style with our Relaxed Linen Shirt. Made from 100% European linen, it gets softer with every wash. The relaxed fit and subtle texture make it the perfect weekend companion.",
      material: "100% European Linen", care: "Machine wash 30°C, lay flat to dry",
      isNew: false, isFeatured: true,
      reviews: []
    },
    {
      id: 6, name: "Straight-Leg Denim Jeans", category: "casual",
      subcategory: "Jeans", price: 6800, originalPrice: 7500, discount: 9,
      badge: "",
      sizes: ["28","30","32","34","36","38"],
      outOfStock: ["28"],
      colors: [{name:"Mid Wash",code:"#4A708B"},{name:"Dark Indigo",code:"#1a2b5a"},{name:"Black",code:"#1a1a1a"}],
      images: [
        "https://placehold.co/600x800/4a708b/ffffff?text=Denim+Jeans+1",
        "https://placehold.co/600x800/4a708b/ffffff?text=Denim+Jeans+2"
      ],
      rating: 4.4, reviewCount: 241,
      description: "Our Straight-Leg Denim Jeans are cut from authentic Japanese selvedge denim for unmatched durability and style. The classic five-pocket design and straight leg give a timeless, versatile silhouette.",
      material: "99% Cotton 1% Elastane — Japanese Selvedge", care: "Machine wash cold inside-out",
      isNew: false, isFeatured: false,
      reviews: []
    },
    {
      id: 7, name: "Floral Midi Dress", category: "casual",
      subcategory: "Dresses", price: 5200, originalPrice: 5200, discount: 0,
      badge: "new",
      sizes: ["XS","S","M","L","XL"],
      outOfStock: [],
      colors: [{name:"Floral Blue",code:"#6B8CBF"},{name:"Floral Pink",code:"#D4849A"},{name:"Floral Green",code:"#7A9E7E"}],
      images: [
        "https://placehold.co/600x800/6b8cbf/ffffff?text=Floral+Dress+1",
        "https://placehold.co/600x800/6b8cbf/ffffff?text=Floral+Dress+2"
      ],
      rating: 4.9, reviewCount: 98,
      description: "Feminine and free-spirited, the Floral Midi Dress features a flowing chiffon fabric with an exclusive floral print. The adjustable waist tie and flutter sleeves create a flattering silhouette for any body type.",
      material: "100% Polyester Chiffon", care: "Hand wash cold or delicate cycle",
      isNew: true, isFeatured: true,
      reviews: []
    },
    {
      id: 8, name: "Power Suit Dress", category: "office",
      subcategory: "Dresses", price: 9800, originalPrice: 12000, discount: 18,
      badge: "sale",
      sizes: ["XS","S","M","L","XL","XXL"],
      outOfStock: [],
      colors: [{name:"Powder Blue",code:"#B0C4DE"},{name:"Ivory",code:"#FFFFF0"},{name:"Blush Rose",code:"#FFB7C5"}],
      images: [
        "https://placehold.co/600x800/b0c4de/555555?text=Power+Dress+1",
        "https://placehold.co/600x800/b0c4de/555555?text=Power+Dress+2"
      ],
      rating: 4.8, reviewCount: 55,
      description: "Command the room with our Power Suit Dress. The structured fabric and tailored cut project confidence and authority. A concealed back zipper and fully lined interior ensure an impeccable finish.",
      material: "60% Viscose 40% Polyester", care: "Dry clean recommended",
      isNew: false, isFeatured: true,
      reviews: []
    },
    {
      id: 9, name: "Oversized Graphic Hoodie", category: "casual",
      subcategory: "Hoodies", price: 4200, originalPrice: 4200, discount: 0,
      badge: "hot",
      sizes: ["S","M","L","XL","XXL","3XL"],
      outOfStock: [],
      colors: [{name:"Washed Black",code:"#2d2d2d"},{name:"Stone",code:"#B0A898"},{name:"Dusty Rose",code:"#DCAE96"}],
      images: [
        "https://placehold.co/600x800/2d2d2d/ffffff?text=Graphic+Hoodie+1",
        "https://placehold.co/600x800/2d2d2d/ffffff?text=Graphic+Hoodie+2"
      ],
      rating: 4.6, reviewCount: 203,
      description: "Our Oversized Graphic Hoodie is the ultimate streetwear piece. Made from a heavyweight 400gsm cotton fleece, it's warm, cozy, and makes a style statement without trying too hard.",
      material: "100% Heavyweight Cotton Fleece 400gsm", care: "Machine wash 30°C, do not tumble dry",
      isNew: false, isFeatured: false,
      reviews: []
    },
    {
      id: 10, name: "Pleated Wide-Leg Trousers", category: "office",
      subcategory: "Trousers", price: 7200, originalPrice: 8500, discount: 15,
      badge: "sale",
      sizes: ["XS","S","M","L","XL","XXL"],
      outOfStock: [],
      colors: [{name:"Sand",code:"#C2A57A"},{name:"Jet Black",code:"#0D0D0D"},{name:"Sage",code:"#A8B5A0"}],
      images: [
        "https://placehold.co/600x800/c2a57a/555555?text=Wide+Leg+Pants+1",
        "https://placehold.co/600x800/c2a57a/555555?text=Wide+Leg+Pants+2"
      ],
      rating: 4.5, reviewCount: 74,
      description: "These Pleated Wide-Leg Trousers offer a sophisticated silhouette that balances structure and flow. The high waist and soft pleats elongate the figure, while the premium fabric drapes elegantly all day.",
      material: "70% Viscose 30% Linen", care: "Hand wash or dry clean",
      isNew: false, isFeatured: false,
      reviews: []
    },
    {
      id: 11, name: "Casual Polo Shirt", category: "casual",
      subcategory: "Shirts", price: 2800, originalPrice: 2800, discount: 0,
      badge: "new",
      sizes: ["S","M","L","XL","XXL","3XL"],
      outOfStock: [],
      colors: [{name:"Navy",code:"#1a1a2e"},{name:"White",code:"#FFFFFF"},{name:"Burgundy",code:"#800020"},{name:"Forest Green",code:"#228B22"}],
      images: [
        "https://placehold.co/600x800/1a1a2e/ffffff?text=Polo+Shirt+1",
        "https://placehold.co/600x800/1a1a2e/ffffff?text=Polo+Shirt+2"
      ],
      rating: 4.3, reviewCount: 156,
      description: "A wardrobe staple reimagined. Our Casual Polo Shirt is knitted from premium pique cotton with ribbed collar and cuffs. The subtle texture adds visual interest while the cut remains comfortable and wearable.",
      material: "100% Pique Cotton", care: "Machine wash 40°C",
      isNew: true, isFeatured: false,
      reviews: []
    },
    {
      id: 12, name: "Knit Pencil Skirt", category: "office",
      subcategory: "Skirts", price: 4100, originalPrice: 5200, discount: 21,
      badge: "sale",
      sizes: ["XS","S","M","L","XL"],
      outOfStock: [],
      colors: [{name:"Camel",code:"#C19A6B"},{name:"Midnight Blue",code:"#191970"},{name:"Cream",code:"#FFFDD0"}],
      images: [
        "https://placehold.co/600x800/c19a6b/ffffff?text=Pencil+Skirt+1",
        "https://placehold.co/600x800/c19a6b/ffffff?text=Pencil+Skirt+2"
      ],
      rating: 4.6, reviewCount: 88,
      description: "The Knit Pencil Skirt adds refined sophistication to any office look. Its sleek, form-fitting silhouette is crafted from a premium stretch knit fabric that moves with you, maintaining its shape all day.",
      material: "60% Viscose 35% Nylon 5% Elastane", care: "Hand wash cold",
      isNew: false, isFeatured: false,
      reviews: []
    }
  ],

  categories: [
    { id: "casual", name: "Casual Wear", count: 6, img: "https://placehold.co/400x600/87A96B/ffffff?text=Casual+Wear" },
    { id: "office", name: "Office Wear", count: 6, img: "https://placehold.co/400x600/36454f/ffffff?text=Office+Wear" },
    { id: "dresses", name: "Dresses", count: 2, img: "https://placehold.co/400x600/D4849A/ffffff?text=Dresses" },
    { id: "accessories", name: "Accessories", count: 0, img: "https://placehold.co/400x600/c9a84c/ffffff?text=Accessories" }
  ],

  sizeChart: {
    tops: {
      headers: ["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)", "Shoulder (cm)", "Length (cm)"],
      rows: [
        ["XS", "80-84", "63-67", "88-92", "36", "60"],
        ["S",  "84-88", "67-71", "92-96", "38", "63"],
        ["M",  "88-94", "71-76", "96-101", "40", "66"],
        ["L",  "94-100","76-82", "101-107","42", "69"],
        ["XL", "100-108","82-89","107-114","44", "72"],
        ["XXL","108-116","89-97","114-122","46", "75"],
        ["3XL","116-126","97-106","122-132","48", "78"]
      ]
    },
    bottoms: {
      headers: ["Size (Waist)", "Waist (cm)", "Hip (cm)", "Inseam (cm)", "Thigh (cm)", "Rise (cm)"],
      rows: [
        ["28", "71-73",  "92-94",  "79", "55", "25"],
        ["30", "75-77",  "96-98",  "80", "57", "26"],
        ["32", "80-82",  "101-103","81", "59", "27"],
        ["34", "85-87",  "106-108","82", "61", "28"],
        ["36", "90-92",  "111-113","83", "63", "29"],
        ["38", "96-98",  "117-119","84", "65", "30"]
      ]
    }
  },

  deliveryOptions: [
    { id: "standard", name: "Standard Delivery", time: "5-7 business days", price: 350, free_above: 5000 },
    { id: "express", name: "Express Delivery", time: "2-3 business days", price: 650, free_above: 10000 },
    { id: "nextday", name: "Next Day Delivery", time: "1 business day", price: 950, free_above: null }
  ],

  paymentMethods: [
    { id: "cod", name: "Cash on Delivery", icon: "fa-money-bill-wave" },
    { id: "visa", name: "Visa", icon: "fa-cc-visa" },
    { id: "master", name: "Mastercard", icon: "fa-cc-mastercard" },
    { id: "amex", name: "American Express", icon: "fa-cc-amex" },
    { id: "koko", name: "KOKO", icon: "fa-percent" },
    { id: "mintpay", name: "Mintpay", icon: "fa-leaf" }
  ]
};

if (typeof module !== 'undefined') module.exports = LuxeData;
