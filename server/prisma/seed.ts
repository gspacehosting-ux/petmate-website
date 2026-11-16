import {
  PrismaClient,
  ProductCategory,
  PetType,
  BlogCategory,
  BlogStatus,
  FormType,
  SubmissionStatus,
  GalleryCategory,
} from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables for seeding
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Petmate Production Database Seeding ---');

  // 1. Seed Admin Account (Safe idempotent check, password from environment variable)
  const adminEmail = 'admin@petmate.com';
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const seedPassword = process.env.ADMIN_SEED_PASSWORD;
    if (!seedPassword) {
      console.warn(
        '⚠️  [SECURITY WARNING] ADMIN_SEED_PASSWORD environment variable is not set. Using secure fallback seed password.'
      );
    }

    const rawPassword = seedPassword || 'PetmateAdminSecure2026!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    await prisma.admin.create({
      data: {
        id: 'admin-primary',
        email: adminEmail,
        passwordHash,
        name: 'Petmate Administrator',
        role: 'admin',
      },
    });
    console.log(`✓ Admin account created successfully for: ${adminEmail}`);
  } else {
    console.log('• Admin account already exists in database. Existing credentials preserved.');
  }

  // 2. Seed Website Settings (Singleton row ID: 1, idempotent upsert)
  await prisma.websiteSettings.upsert({
    where: { id: 1 },
    update: {}, // Preserve any live updates made by admin
    create: {
      id: 1,
      websiteName: 'Petmate',
      tagline: "Your Pet's Best Friend",
      phone: '6363426084',
      email: 'info@Petmate.com',
      location: 'Bangalore',
      weekdayHours: 'Mon - Sat: 9:00 AM - 8:30 PM',
      weekendHours: 'Sun: 10:00 AM - 6:00 PM',
      instagramUrl: 'https://instagram.com',
      facebookUrl: 'https://facebook.com',
      youtubeUrl: 'https://youtube.com',
      whatsappUrl: 'https://wa.me/916363426084',
      footerAbout:
        "Bangalore's trusted pet shop dedicated to bringing you 100% genuine pet food, accessories, grooming essentials, and loving care for your furry family members.",
    },
  });
  console.log('✓ Website settings verified / seeded.');

  // 3. Seed Products (All 16 catalog items from initialProducts.ts, idempotent upsert)
  const allProducts = [
    {
      id: 'prod-1',
      name: 'Royal Canin Medium Adult',
      subtitle: 'Dog Food (3 Kg)',
      category: ProductCategory.Food,
      petType: PetType.Dog,
      price: 2699,
      originalPrice: 2999,
      discount: 10,
      rating: 4.8,
      reviewCount: 142,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 45,
      isFeatured: true,
      description:
        'Specially formulated balanced nutrition for medium breed adult dogs (11 to 25 kg) from 12 months to 7 years old. Helps maintain natural defenses with an antioxidant complex and mannan-oligosaccharides, promoting optimal digestion and coat shine.',
      weightOrSize: '3 Kg',
    },
    {
      id: 'prod-2',
      name: 'Whiskas Adult Cat Food',
      subtitle: 'Ocean Fish Flavour (1.2 Kg)',
      category: ProductCategory.Food,
      petType: PetType.Cat,
      price: 699,
      originalPrice: 799,
      discount: 13,
      rating: 4.7,
      reviewCount: 98,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 60,
      isFeatured: true,
      description:
        '100% complete and balanced meal for adult cats aged 1+ years. Enriched with omega 3 & 6 fatty acids and zinc for shiny fur, essential taurine for healthy eyesight, and vitamin E for a resilient immune system.',
      weightOrSize: '1.2 Kg',
    },
    {
      id: 'prod-3',
      name: 'Dog Harness',
      subtitle: 'Adjustable & Comfortable',
      category: ProductCategory.Accessories,
      petType: PetType.Dog,
      price: 549,
      originalPrice: 699,
      discount: 21,
      rating: 4.9,
      reviewCount: 215,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 30,
      isFeatured: true,
      description:
        'Ergonomic no-pull dog chest harness crafted with breathable air-mesh padding and reinforced nylon webbing. Features dual zinc-alloy leash attachment clips, night reflective safety strips, and easy quick-snap buckles.',
      weightOrSize: 'Medium / Large',
    },
    {
      id: 'prod-4',
      name: 'Pet Rope Toy',
      subtitle: 'Durable & Safe',
      category: ProductCategory.Toys,
      petType: PetType.Dog,
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.6,
      reviewCount: 84,
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 50,
      isFeatured: true,
      description:
        'Heavy-duty knotted braided cotton rope toy created for energetic chewing, fetching, and interactive tug-of-war. The natural fibers gently floss teeth and massage gums while playing to reduce tartar buildup.',
      weightOrSize: '35 cm Length',
    },
    {
      id: 'prod-5',
      name: 'Pet Feeding Bowl',
      subtitle: 'Stainless Steel (Anti-Skid)',
      category: ProductCategory.Accessories,
      petType: PetType.AllPets,
      price: 349,
      originalPrice: 449,
      discount: 22,
      rating: 4.9,
      reviewCount: 167,
      image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 40,
      isFeatured: true,
      description:
        'Premium rust-resistant food-grade stainless steel pet feeding bowl with permanent silicone rubber anti-skid bottom. Prevents bowl sliding across tiles, minimizes spills, and is dishwasher safe.',
      weightOrSize: '850 ml',
    },
    {
      id: 'prod-6',
      name: 'Pedigree Adult Meat & Rice',
      subtitle: 'Complete Dry Dog Food (3 Kg)',
      category: ProductCategory.Food,
      petType: PetType.Dog,
      price: 849,
      originalPrice: 950,
      discount: 11,
      rating: 4.5,
      reviewCount: 310,
      image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 55,
      isFeatured: false,
      description:
        'Wholesome nutritious meal formulated with 20% crude protein, 10% crude fat, and essential minerals to strengthen canine muscles, teeth, and bone density.',
      weightOrSize: '3 Kg',
    },
    {
      id: 'prod-7',
      name: 'SmartyPet Interactive Cat Scratching Tree',
      subtitle: 'Sisal Rope & Plush Perch',
      category: ProductCategory.Toys,
      petType: PetType.Cat,
      price: 1499,
      originalPrice: 1999,
      discount: 25,
      rating: 4.8,
      reviewCount: 76,
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 20,
      isFeatured: false,
      description:
        'Multi-tier cat scratcher wrapped in heavy-duty natural sisal fiber. Satisfies natural scratching instincts, safeguards home furniture, and includes a dangling bell toy for active playtime.',
      weightOrSize: '55 cm Height',
    },
    {
      id: 'prod-8',
      name: 'Rio Daily Premium Bird Seed Mix',
      subtitle: 'For Budgies & Parakeets (1 Kg)',
      category: ProductCategory.Food,
      petType: PetType.Bird,
      price: 499,
      originalPrice: 599,
      discount: 17,
      rating: 4.9,
      reviewCount: 62,
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 35,
      isFeatured: false,
      description:
        'Carefully curated balanced blend of cleaned yellow millet, red millet, canary seed, peeled oats, and calcium granules to fuel bright plumage, vocal agility, and vitality in small birds.',
      weightOrSize: '1 Kg',
    },
    {
      id: 'prod-9',
      name: 'Oxbow Western Timothy Hay',
      subtitle: 'High Fiber Grass for Rabbits (1 Kg)',
      category: ProductCategory.Food,
      petType: PetType.SmallPet,
      price: 899,
      originalPrice: 1099,
      discount: 18,
      rating: 4.9,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 25,
      isFeatured: false,
      description:
        'Hand-sorted long-strand aromatic Timothy grass hay essential for healthy rabbit and guinea pig digestion and natural dental wear. 100% natural and pesticide-free.',
      weightOrSize: '1 Kg',
    },
    {
      id: 'prod-10',
      name: 'Bio-Groom Fluffy Puppy Shampoo',
      subtitle: 'Tear-Free Formula (355 ml)',
      category: ProductCategory.Grooming,
      petType: PetType.Dog,
      price: 649,
      originalPrice: 750,
      discount: 13,
      rating: 4.8,
      reviewCount: 114,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 40,
      isFeatured: false,
      description:
        'Ultra-mild soap-free conditioning shampoo created specifically for puppies and pets with sensitive delicate skin. Leaves coats fluffy, clean, smelling fresh, and without eye irritation.',
      weightOrSize: '355 ml',
    },
    {
      id: 'prod-11',
      name: 'Furminator Undercoat Deshedding Tool',
      subtitle: 'Reduces Shedding up to 90%',
      category: ProductCategory.Grooming,
      petType: PetType.AllPets,
      price: 1199,
      originalPrice: 1599,
      discount: 25,
      rating: 4.9,
      reviewCount: 304,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 30,
      isFeatured: false,
      description:
        'Stainless steel deShedding edge reaches deep beneath topcoat to safely and gently remove loose undercoat hair without cutting skin or damaging outer coat.',
      weightOrSize: 'Medium',
    },
    {
      id: 'prod-12',
      name: 'Himalaya Healthy Pet Tonic',
      subtitle: 'Herbal Supplement (200 ml)',
      category: ProductCategory.HealthCare,
      petType: PetType.AllPets,
      price: 249,
      originalPrice: 299,
      discount: 17,
      rating: 4.7,
      reviewCount: 132,
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 60,
      isFeatured: false,
      description:
        'Time-tested herbal nutrition booster formulated with Indian Gooseberry and natural plant extracts to support appetite, energy, liver function, and overall pet wellness.',
      weightOrSize: '200 ml',
    },
    {
      id: 'prod-13',
      name: 'Bird Swing & Chew Ladder',
      subtitle: 'Natural Wood & Bells',
      category: ProductCategory.Toys,
      petType: PetType.Bird,
      price: 329,
      originalPrice: 420,
      discount: 22,
      rating: 4.6,
      reviewCount: 45,
      image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 40,
      isFeatured: false,
      description:
        'Sturdy hanging wooden perch ladder with food-grade non-toxic dyes and cheerful metallic bells. Keeps cage birds physically active and mentally stimulated.',
      weightOrSize: '8 Rungs',
    },
    {
      id: 'prod-14',
      name: 'Little One Dwarf Hamster Food',
      subtitle: 'Varied Seed & Vitamin Grain (400 g)',
      category: ProductCategory.Food,
      petType: PetType.SmallPet,
      price: 380,
      originalPrice: 450,
      discount: 16,
      rating: 4.8,
      reviewCount: 52,
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 45,
      isFeatured: false,
      description:
        'Nutritious tailored daily seed mixture enriched with yucca extract to reduce enclosure odor and balanced with extra proteins for small rodents.',
      weightOrSize: '400 g',
    },
    {
      id: 'prod-15',
      name: 'Cat Laser Pointer & LED Chaser',
      subtitle: 'USB Rechargeable 5 Patterns',
      category: ProductCategory.Toys,
      petType: PetType.Cat,
      price: 399,
      originalPrice: 599,
      discount: 33,
      rating: 4.8,
      reviewCount: 220,
      image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 50,
      isFeatured: false,
      description:
        'Rechargeable multi-mode red laser exercise toy with paw, mouse, and dot projection patterns for hours of feline chase and exercise.',
      weightOrSize: 'USB Rechargeable',
    },
    {
      id: 'prod-16',
      name: 'Barkbutler Squeaky Plush Bone',
      subtitle: 'Reinforced Chewer Toy',
      category: ProductCategory.Toys,
      petType: PetType.Dog,
      price: 449,
      originalPrice: 550,
      discount: 18,
      rating: 4.7,
      reviewCount: 78,
      image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 40,
      isFeatured: false,
      description:
        'Soft yet puncture-resistant textured plush bone with an internal puncture-proof squeaker. Keeps dogs occupied and soothes separation anxiety.',
      weightOrSize: 'Large',
    },
  ];

  for (const p of allProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {}, // Never overwrite live modifications made in dashboard
      create: p,
    });
  }
  console.log(`✓ Seeded/verified all ${allProducts.length} product catalog items.`);

  // 4. Seed Blogs (All 6 full articles from initialBlogs.ts, idempotent upsert)
  const allBlogs = [
    {
      id: 'blog-1',
      title: 'Best Food for a Healthy and Active Dog',
      slug: 'best-food-for-healthy-active-dog',
      category: BlogCategory.DogCare,
      status: BlogStatus.Published,
      author: 'Dr. Priya Sharma, Canine Nutritionist',
      publishedDate: 'Nov 12, 2026',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      readTime: '4 min read',
      shortDescription:
        'Discover the ideal balance of proteins, complex carbs, and essential fats needed to keep your dog energized and thriving at every life stage.',
      content:
        'Feeding your dog the right diet is one of the most impactful decisions you make as a pet parent. Whether you have an energetic puppy or a calm senior companion, balanced nutrition forms the foundation of vitality, joint health, and a glossy coat.\n\n### 1. High-Quality Animal Protein\nCanines thrive on animal-derived proteins such as whole chicken, lamb, fish, and eggs. These supply indispensable amino acids that help maintain lean muscle mass, support cellular repair, and build resilient immune antibodies.\n\n### 2. Complex Carbohydrates & Fiber\nWholesome grains like brown rice and oats, or grain-free alternatives like sweet potatoes, provide continuous stamina throughout the day.\n\n### 3. Vital Omega Fatty Acids\nOmega-3 and Omega-6 fatty acids soothe irritated skin, dramatically decrease seasonal shedding, and preserve joint mobility.\n\n### 4. Portion Control & Hydration\nAlways measure kibble with a dedicated measuring cup rather than free-feeding. Make sure your dog always has direct access to fresh, cool drinking water.',
    },
    {
      id: 'blog-2',
      title: 'Simple Tips to Keep Your Cat Happy at Home',
      slug: 'simple-tips-keep-cat-happy-at-home',
      category: BlogCategory.CatCare,
      status: BlogStatus.Published,
      author: 'Rahul Verma, Feline Behavioral Specialist',
      publishedDate: 'Nov 08, 2026',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
      readTime: '3 min read',
      shortDescription:
        'Indoor cats need mental stimulation and vertical space. Here are four practical, science-backed ideas to turn your apartment into a feline paradise.',
      content:
        'Indoor cats live safer, healthier lives, but they can easily become bored or anxious without proper mental and physical stimulation. With a few intentional design touches, you can satisfy your cat\'s natural hunting and territorial instincts.\n\n### 1. Maximize Vertical Territory\nCats love surveying their domain from elevated vantage points. Invest in a sturdy multi-level cat tree or wall-mounted perches placed near a sunlit window.\n\n### 2. Dedicated Scratching Zones\nScratching is vital for cats: it trims claw husks, relieves stress, and scent-marks their comfort zone.\n\n### 3. Interactive Daily Play\nSpend 10 to 15 minutes twice a day playing with wand toys, feather teasers, or laser chasers.\n\n### 4. Fresh Water & Litter Cleanliness\nCats are fastidious creatures. Scoop litter boxes daily and position their water bowl away from their feeding station.',
    },
    {
      id: 'blog-3',
      title: 'The Importance of Regular Grooming for Pets',
      slug: 'importance-of-regular-grooming-for-pets',
      category: BlogCategory.PetGrooming,
      status: BlogStatus.Published,
      author: 'Petmate Grooming Care Team',
      publishedDate: 'Nov 02, 2026',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
      readTime: '5 min read',
      shortDescription:
        'Grooming is more than making your pet look cute—it is crucial healthcare that prevents matting, skin irritations, and ear infections.',
      content:
        'Many pet parents assume grooming is simply a cosmetic luxury. In reality, a consistent grooming schedule is a primary preventative healthcare measure for dogs and cats alike.\n\n### 1. Removing Mats and Trapped Dirt\nDense undercoats easily tangle into painful mats that pull on delicate skin and trap moisture, leading to bacterial and fungal infections.\n\n### 2. Regular Ear & Eye Checks\nEars with heavy floppy pinnae frequently trap humidity and dust. Routine ear cleaning with gentle wipes prevents painful ear mites and yeast infections.\n\n### 3. Nail Trimming Prevents Postural Pain\nOvergrown nails change the angle at which your pet\'s paw hits the ground, causing chronic joint discomfort.\n\n### 4. Professional Baths and Gentle De-shedding\nA professional bath with pH-balanced, tear-free pet shampoo cleans deep into the double coat while nourishing the skin barrier.',
    },
    {
      id: 'blog-4',
      title: 'Beginner Guide to Bird Nutrition and Mental Wellness',
      slug: 'beginner-guide-bird-nutrition-mental-wellness',
      category: BlogCategory.PetNutrition,
      status: BlogStatus.Published,
      author: 'Ananya Rao, Avian Care Consultant',
      publishedDate: 'Oct 28, 2026',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
      readTime: '4 min read',
      shortDescription:
        'Why an all-seed diet is not enough for pet birds and how introducing fresh greens, minerals, and foraging toys enriches their daily routine.',
      content:
        'Companion birds such as budgies, cockatiels, and lovebirds are remarkably intelligent and socially communicative. To maintain vibrant plumage and energetic song, their nutrition needs more variety than standard seed bags.\n\n### The Problem with All-Seed Diets\nWhile seeds provide calories, an all-seed diet often lacks crucial vitamin A, calcium, and essential amino acids.\n\n### Introducing Fresh Greens and Pellets\nGradually introduce bird-safe fresh vegetables such as finely chopped spinach, grated carrots, broccoli florets, and steamed sweet potato.\n\n### Foraging and Mental Exercise\nBirds in the wild spend hours foraging for food. Use puzzle toys and chewable wooden ladders in their cage to encourage natural curiosity.',
    },
    {
      id: 'blog-5',
      title: 'Positive Reinforcement Training: How to Teach Loose-Leash Walking',
      slug: 'positive-reinforcement-training-loose-leash-walking',
      category: BlogCategory.PetTraining,
      status: BlogStatus.Published,
      author: 'Vikram Seth, Certified Dog Trainer',
      publishedDate: 'Oct 20, 2026',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      readTime: '4 min read',
      shortDescription:
        'Stop the tug-of-war on daily walks. Learn how rewarding focus and using front-clip harnesses transforms walking your dog into pure joy.',
      content:
        'Does your daily walk feel like an Olympic arm workout? Pulling on the leash is an instinctive canine response known as opposition reflex: when a dog feels tension pulling back, their reflex is to pull harder forward.\n\n### Step 1: Ditch Neck-Choke Collars\nSwitching to an ergonomic front-clip chest harness instantly reduces pulling leverage without putting dangerous pressure on the dog\'s trachea.\n\n### Step 2: The "Be a Tree" Rule\nWhenever your dog lunges ahead and the leash becomes taut, immediately stop moving. Freeze in place until they slacken the leash or look back toward you.\n\n### Step 3: High-Value Rewards\nCarry soft, smelly training treats. Reward your dog right beside your hip when they are walking calmly with a loose J-shaped leash.',
    },
    {
      id: 'blog-6',
      title: 'Creating a Safe & Enrichment-Rich Rabbit Enclosure',
      slug: 'creating-safe-enrichment-rabbit-enclosure',
      category: BlogCategory.PetLifestyle,
      status: BlogStatus.Published,
      author: 'Deepa Nair, Small Animal Specialist',
      publishedDate: 'Oct 14, 2026',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
      readTime: '3 min read',
      shortDescription:
        'Rabbits need room to hop, burrow, and explore. Learn how to bunny-proof your room and set up the ultimate stress-free small pet habitat.',
      content:
        'Small pets like dwarf rabbits and guinea pigs are sensitive prey animals that require a quiet, hazard-free environment to flourish. Standard small wire cages are too restrictive for daily life.\n\n### 1. Puppy Playpens Over Tiny Cages\nUse modular metal exercise pens to give your bunny at least 12 square feet of continuous running space.\n\n### 2. Cord Bunny-Proofing\nRabbits instinctively chew on rubbery items. Encase all electrical cords and charger cables in plastic spiral conduit sleeves.\n\n### 3. Unlimited Hay Station\n80% of a rabbit\'s diet must be fresh, clean grass hay. Place their hay feeder directly above their litter pan, as rabbits naturally like to munch hay while using their litter tray.',
    },
  ];

  for (const b of allBlogs) {
    await prisma.blogPost.upsert({
      where: { id: b.id },
      update: {},
      create: b,
    });
  }
  console.log(`✓ Seeded/verified all ${allBlogs.length} blog articles.`);

  // 5. Seed Gallery Images (All 10 images from initialGallery.ts, idempotent upsert)
  const allGallery = [
    {
      id: 'gal-1',
      filename: 'hero-dog-cat-friends.jpg',
      category: GalleryCategory.Homepage,
      fileUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
      fileSize: '342 KB',
      dimensions: '1920 x 1080',
      uploadDate: '10 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-2',
      filename: 'category-golden-dog.jpg',
      category: GalleryCategory.Dogs,
      fileUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
      fileSize: '215 KB',
      dimensions: '800 x 800',
      uploadDate: '10 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-3',
      filename: 'category-tabby-cat.jpg',
      category: GalleryCategory.Cats,
      fileUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      fileSize: '198 KB',
      dimensions: '800 x 800',
      uploadDate: '10 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-4',
      filename: 'category-budgie-bird.jpg',
      category: GalleryCategory.Birds,
      fileUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
      fileSize: '175 KB',
      dimensions: '800 x 800',
      uploadDate: '11 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-5',
      filename: 'category-cute-rabbit.jpg',
      category: GalleryCategory.SmallPets,
      fileUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
      fileSize: '188 KB',
      dimensions: '800 x 800',
      uploadDate: '11 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-6',
      filename: 'service-dog-grooming-shampoo.jpg',
      category: GalleryCategory.Services,
      fileUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1000&q=80',
      fileSize: '412 KB',
      dimensions: '1200 x 800',
      uploadDate: '11 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-7',
      filename: 'product-royal-canin-food.jpg',
      category: GalleryCategory.Products,
      fileUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
      fileSize: '280 KB',
      dimensions: '800 x 800',
      uploadDate: '12 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-8',
      filename: 'product-dog-harness-red.jpg',
      category: GalleryCategory.Products,
      fileUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
      fileSize: '260 KB',
      dimensions: '800 x 800',
      uploadDate: '12 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-9',
      filename: 'blog-puppy-nutrition.jpg',
      category: GalleryCategory.Blog,
      fileUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      fileSize: '310 KB',
      dimensions: '900 x 600',
      uploadDate: '12 Nov 2026',
      mimeType: 'image/jpeg',
    },
    {
      id: 'gal-10',
      filename: 'bangalore-store-lifestyle.jpg',
      category: GalleryCategory.General,
      fileUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80',
      fileSize: '450 KB',
      dimensions: '1280 x 850',
      uploadDate: '12 Nov 2026',
      mimeType: 'image/jpeg',
    },
  ];

  for (const g of allGallery) {
    await prisma.galleryImage.upsert({
      where: { id: g.id },
      update: {},
      create: g,
    });
  }
  console.log(`✓ Seeded/verified all ${allGallery.length} gallery image records.`);

  // 6. Seed Sample Initial Submissions (Idempotent upsert)
  await prisma.formSubmission.upsert({
    where: { id: 'sub-101' },
    update: {},
    create: {
      id: 'sub-101',
      formType: FormType.ServiceEnquiryForm,
      customerName: 'Ananya Deshmukh',
      phone: '9845123456',
      email: 'ananya.d@example.com',
      petType: 'Golden Retriever Dog',
      serviceRequired: 'Full Grooming & Spa Bath',
      preferredDate: '2026-11-16',
      message: 'Looking for a de-shedding spa bath and gentle nail trimming for our 2-year-old golden retriever Leo.',
      status: SubmissionStatus.New,
    },
  });
  console.log('✓ Seeded/verified starter inquiry submission.');

  console.log('--- Petmate Production Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
