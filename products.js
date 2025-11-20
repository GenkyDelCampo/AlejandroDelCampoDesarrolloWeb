// Base de datos de productos - CryptoLab A&A
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        category: "Smartphones",
        price: 24999,
        icon: "📱",
        description: "El último iPhone con chip A17 Pro, cámara de 48MP con zoom óptico 5x, pantalla ProMotion de 120Hz y titanio aeroespacial. Incluye Dynamic Island y USB-C.",
        stock: 15,
        rating: 4.9,
        brand: "Apple"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        category: "Smartphones",
        price: 26999,
        icon: "📱",
        description: "Smartphone Android premium con Snapdragon 8 Gen 3, S Pen integrado, cámara de 200MP, pantalla AMOLED 6.8' y batería de 5000mAh. Ideal para productividad.",
        stock: 12,
        rating: 4.8,
        brand: "Samsung"
    },
    {
        id: 3,
        name: "MacBook Pro M3",
        category: "Laptops",
        price: 45999,
        icon: "💻",
        description: "Laptop profesional con chip M3 de Apple, 16GB RAM, SSD 512GB, pantalla Liquid Retina XDR de 14', hasta 18 horas de batería. Perfecta para diseño y desarrollo.",
        stock: 8,
        rating: 5.0,
        brand: "Apple"
    },
    {
        id: 4,
        name: "Dell XPS 15",
        category: "Laptops",
        price: 35999,
        icon: "💻",
        description: "Laptop Windows premium con Intel Core i7 13va Gen, 16GB RAM, RTX 4050, pantalla 4K OLED táctil de 15.6'. Ideal para creadores de contenido y gaming.",
        stock: 10,
        rating: 4.7,
        brand: "Dell"
    },
    {
        id: 5,
        name: "AirPods Pro (2da Gen)",
        category: "Audífonos",
        price: 5999,
        icon: "🎧",
        description: "Audífonos inalámbricos con cancelación activa de ruido mejorada, audio espacial personalizado, modo transparencia adaptativo y hasta 30 horas con estuche MagSafe.",
        stock: 25,
        rating: 4.8,
        brand: "Apple"
    },
    {
        id: 6,
        name: "Sony WH-1000XM5",
        category: "Audífonos",
        price: 7999,
        icon: "🎧",
        description: "Los mejores audífonos over-ear con cancelación de ruido líder en la industria, 30 horas de batería, audio de alta resolución y diseño premium ultraligero.",
        stock: 18,
        rating: 4.9,
        brand: "Sony"
    },
    {
        id: 7,
        name: "Apple Watch Series 9",
        category: "Smartwatches",
        price: 9999,
        icon: "⌚",
        description: "Smartwatch con chip S9 SiP, pantalla más brillante, Double Tap, monitoreo avanzado de salud con ECG, oxígeno en sangre y temperatura. Resistente al agua 50m.",
        stock: 20,
        rating: 4.8,
        brand: "Apple"
    },
    {
        id: 8,
        name: "Samsung Galaxy Watch 6",
        category: "Smartwatches",
        price: 7999,
        icon: "⌚",
        description: "Reloj inteligente con seguimiento de sueño avanzado, análisis de composición corporal, GPS preciso, pantalla AMOLED y hasta 40 horas de batería.",
        stock: 16,
        rating: 4.6,
        brand: "Samsung"
    },
    {
        id: 9,
        name: "iPad Pro 12.9' M2",
        category: "Tablets",
        price: 28999,
        icon: "📱",
        description: "Tablet profesional con chip M2, pantalla Liquid Retina XDR mini-LED, 5G, Face ID, compatible con Apple Pencil y Magic Keyboard. 128GB almacenamiento.",
        stock: 9,
        rating: 4.9,
        brand: "Apple"
    },
    {
        id: 10,
        name: "Samsung Galaxy Tab S9",
        category: "Tablets",
        price: 19999,
        icon: "📱",
        description: "Tablet Android premium con pantalla Dynamic AMOLED 2X de 11', Snapdragon 8 Gen 2, S Pen incluido, resistente al agua IP68 y hasta 15 horas de batería.",
        stock: 14,
        rating: 4.7,
        brand: "Samsung"
    },
    {
        id: 11,
        name: "Canon EOS R6 Mark II",
        category: "Cámaras",
        price: 48999,
        icon: "📷",
        description: "Cámara mirrorless profesional de 24.2MP, sensor full-frame, 40fps ráfaga, video 4K 60p sin crop, IBIS de 8 stops y enfoque automático dual pixel II.",
        stock: 5,
        rating: 4.9,
        brand: "Canon"
    },
    {
        id: 12,
        name: "Sony A7 IV",
        category: "Cámaras",
        price: 52999,
        icon: "📷",
        description: "Cámara full-frame híbrida con 33MP, video 4K 60p 10-bit, estabilización IBIS 5.5 stops, enfoque AF con reconocimiento de ojos humanos y animales.",
        stock: 6,
        rating: 4.9,
        brand: "Sony"
    },
    {
        id: 13,
        name: "Nintendo Switch OLED",
        category: "Consolas",
        price: 8999,
        icon: "🎮",
        description: "Consola híbrida con pantalla OLED de 7', soporte ajustable mejorado, audio potenciado, 64GB almacenamiento y dock con puerto LAN. Incluye controles Joy-Con.",
        stock: 22,
        rating: 4.8,
        brand: "Nintendo"
    },
    {
        id: 14,
        name: "PlayStation 5",
        category: "Consolas",
        price: 12999,
        icon: "🎮",
        description: "Consola de nueva generación con SSD ultra rápido, gráficos 4K a 120fps, ray tracing, audio 3D Tempest, DualSense con retroalimentación háptica. Incluye lector de discos.",
        stock: 7,
        rating: 4.9,
        brand: "Sony"
    },
    {
        id: 15,
        name: "Xbox Series X",
        category: "Consolas",
        price: 11999,
        icon: "🎮",
        description: "La Xbox más potente con 12 teraflops, 4K nativo 60fps (hasta 120fps), SSD 1TB, Quick Resume, compatibilidad con miles de juegos y Game Pass incluido 3 meses.",
        stock: 11,
        rating: 4.8,
        brand: "Microsoft"
    },
    {
        id: 16,
        name: "Bose SoundLink Revolve+",
        category: "Bocinas",
        price: 5999,
        icon: "🔊",
        description: "Bocina Bluetooth 360° con sonido premium, 17 horas de batería, resistente al agua IPX4, micrófono integrado y asa para transporte. Graves profundos y nítidos.",
        stock: 19,
        rating: 4.7,
        brand: "Bose"
    },
    {
        id: 17,
        name: "JBL Flip 6",
        category: "Bocinas",
        price: 2999,
        icon: "🔊",
        description: "Bocina portátil resistente al agua y polvo IP67, 12 horas de reproducción, PartyBoost para conectar múltiples bocinas, sonido potente y bajos impactantes.",
        stock: 28,
        rating: 4.6,
        brand: "JBL"
    },
    {
        id: 18,
        name: "Kindle Paperwhite",
        category: "E-readers",
        price: 3499,
        icon: "📖",
        description: "Lector de libros electrónicos con pantalla antirreflejos de 6.8', 300 ppi, luz cálida ajustable, resistente al agua IPX8, 8GB almacenamiento y hasta 10 semanas de batería.",
        stock: 24,
        rating: 4.8,
        brand: "Amazon"
    },
    {
        id: 19,
        name: "GoPro Hero 12 Black",
        category: "Cámaras",
        price: 9999,
        icon: "📷",
        description: "Cámara de acción con video 5.3K 60fps, HyperSmooth 6.0, HDR mejorado, TimeWarp 3.0, sumergible hasta 10m, pantallas táctiles duales y control por voz.",
        stock: 13,
        rating: 4.7,
        brand: "GoPro"
    },
    {
        id: 20,
        name: "DJI Mini 3 Pro",
        category: "Drones",
        price: 18999,
        icon: "🚁",
        description: "Dron compacto plegable con cámara 4K 60fps, sensor 1/1.3', True Vertical Shooting, 34 minutos de vuelo, detección de obstáculos tri-direccional y transmisión OcuSync 3.",
        stock: 8,
        rating: 4.9,
        brand: "DJI"
    }
];