// Sample data - this would come from your backend in a real application
export const menuData = {
    restaurantInfo: {
        name: "Lezzet Durağı",
        description: "Geleneksel Türk Mutfağı",
        tagline: "1990'dan beri hizmetinizde",
        address: "Merkez Mah. Güzel Sokak No:123, İstanbul",
        phone: "+90 (212) 555 44 33",
        workingHours: {
            weekdays: "10:00 - 22:00",
            weekend: "10:00 - 23:00",
            friday: "10:00 - 23:30",
            holiday: "11:00 - 22:00"
        },
        rating: "4.8",
        instagram: "@lezzetduragi",
        currency: "TL"
    },
    categories: [
        {
            title: "Başlangıçlar",
            items: [
                {
                    id: "1",
                    name: "Mercimek Çorbası",
                    description: "Geleneksel Türk mutfağının vazgeçilmezi, taze malzemelerle hazırlanan mercimek çorbası",
                    price: 45.00,
                    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
                {
                    id: "2",
                    name: "Humus",
                    description: "Nohut püresi, tahin, zeytinyağı ve baharatlar ile",
                    price: 55.00,
                    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
            ]
        },
        {
            title: "Ana Yemekler",
            items: [
                {
                    id: "3",
                    name: "Izgara Köfte",
                    description: "Özel baharatlarla hazırlanmış ızgara köfte, yanında pilav ve salata ile",
                    price: 120.00,
                    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
                {
                    id: "4",
                    name: "Tavuk Şiş",
                    description: "Marine edilmiş tavuk şiş, özel sos ve garnitür ile",
                    price: 100.00,
                    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
                {
                    id: "5",
                    name: "Pide Çeşitleri",
                    description: "Kaşarlı, kıymalı veya karışık, özel taş fırında pişirilmiş",
                    price: 90.00,
                    image: "https://images.unsplash.com/photo-1628914476768-a7df5abf630b?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
            ]
        },
        {
            title: "Salatalar",
            items: [
                {
                    id: "6",
                    name: "Mevsim Salatası",
                    description: "Taze mevsim yeşillikleri ve özel sos",
                    price: 45.00,
                    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
                {
                    id: "7",
                    name: "Çoban Salatası",
                    description: "Domates, salatalık, biber ve soğan ile klasik çoban salatası",
                    price: 40.00,
                    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
            ]
        },
        {
            title: "Tatlılar",
            items: [
                {
                    id: "8",
                    name: "Künefe",
                    description: "Antep fıstığı ile servis edilen özel yapım künefe",
                    price: 75.00,
                    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
                {
                    id: "9",
                    name: "Sütlaç",
                    description: "Geleneksel tarif ile hazırlanan fırın sütlaç",
                    price: 45.00,
                    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
            ]
        },
        {
            title: "İçecekler",
            items: [
                {
                    id: "10",
                    name: "Türk Kahvesi",
                    description: "Geleneksel Türk kahvesi",
                    price: 30.00,
                    image: "https://images.unsplash.com/photo-1568031813264-d394c5d474b9?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
                {
                    id: "11",
                    name: "Ayran",
                    description: "Ev yapımı ayran",
                    price: 15.00,
                    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
                {
                    id: "12",
                    name: "Taze Meyve Suyu",
                    description: "Portakal, elma veya nar suyu seçenekleri",
                    price: 25.00,
                    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&auto=format&fit=crop&q=60",
                    nutritional_values: {
                        calories: 150,
                        protein: 5,
                        fat: 2,
                        carbohydrates: 10
                    }
                },
            ]
        },
    ],
    modules: {
        wifi: {
            active: true,
            position: "bottom-right",
            networkName: "Restaurant WiFi",
            password: "12345678"
        }
    }
};