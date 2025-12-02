import { Category, Product, Order, OrderStatus } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'hotdogs',
    name: 'Hot Dogs',
    description: 'Os mais pedidos e especiais da casa',
    icon: 'kebab_dining',
    productCount: 8,
  },
  {
    id: 'burgers',
    name: 'Hambúrgueres',
    description: 'Artesanais e suculentos',
    icon: 'lunch_dining',
    productCount: 5,
  },
  {
    id: 'portions',
    name: 'Porções',
    description: 'Para acompanhar ou compartilhar',
    icon: 'restaurant',
    productCount: 6,
  },
  {
    id: 'drinks',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos e água',
    icon: 'local_bar',
    productCount: 10,
  },
  {
    id: 'combos',
    name: 'Combos',
    description: 'Economize com nossas combinações',
    icon: 'fastfood',
    productCount: 4,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'dog-cheddar-bacon',
    categoryId: 'hotdogs',
    name: 'Dogão Cheddar e Bacon',
    description: 'Pão, salsicha, cheddar cremoso, bacon crocante.',
    price: 22.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg8Ot5_YpJt82Kc6w_5IcjVCv9L6E1AYSDh5CDiigATQSPOtchSoUIIGjW5a3cYPLQ3WNgoMtH-H0skRfNC3LcePS8z2JMP3P9Um0GAmuo_DRbjxMh3pAT0RJGx1AmVFFoyxGnYMg-eumcLtPaDysFw1_p_km7lxH3QvRRZ9hpOx1OBWjdbhQkxdhC3YkhNnhI7BFy3B_uN6xeM60n-gO62NgdrsZWdJWtlCPDjhVgGPrvnV34KhNiEVt8a-7qzdGOfVXMltI_w',
  },
  {
    id: 'dog-especial',
    categoryId: 'hotdogs',
    name: 'Hot Dog Especial',
    description: 'Pão, duas salsichas, purê, vinagrete e batata palha.',
    price: 25.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBacC8lysgzeMZjcSdW3SaxJzzmsOsmYyFdRHbISeDcjGHWSYn2SBsujDR0locn1tN0eg_EtzV6a5TLhT-IqzCw5fKBfYOJSFaSUDM7YF8kqE2C8ftc3QHGfv_JuKJ-oS5aTOZNhJ-1QN4gMAPz0VaiJ9CiGvnxY6AIaNY7qJAKREPKR_Qf6fnCjyjt1HMU-MaVukyTh0qkhhzY8Jtk403DsID2dAY6mBofzui1Ult1ikc1U1e7ifzN0UZv0D6h96-IHAIEsd4IrA',
  },
  {
    id: 'dog-classico',
    categoryId: 'hotdogs',
    name: 'Dogão Clássico',
    description: 'Pão, salsicha, molho de tomate, milho, ervilha e batata palha.',
    price: 15.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMyFOr-awkcy2jLFvzLIE-CFBDj3PZHKNSleC1BNJj-xYjRHZPBbjE8UiayFUHFHhhGVt226Q8DrLlT08K7-lDyAmm1gb1gQb8fMmm6bEGTXEhbgYmd45p0QQcL_z0aWOdXrjClYMSeUd9YDAgauxjOJbFymjkWWP9aAa4UwC5ztfoyUaETwC6TfjRPMZmzudHEU-RIFaE09RsPWCuCzm7JxoewFOIFyIiNShxA5dzFVMamKOK-I00PAgLXoTPXqVhW0nAs_-S3Q',
  },
  {
    id: 'burger-casa',
    categoryId: 'burgers',
    name: 'Burger da Casa',
    description: 'Pão, carne 180g, queijo, alface, tomate e molho especial.',
    price: 28.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADRrm0yZfVMGwSGPWWrW-jRVVdjwqgrhhIrpUwlo7H-Reqj4gNHaYYyR-uygaoU_WtXp8ulf4A4Wghurdr1stQ7xpLJ7IPfBlnzYd7GaLFDqNwBTpWaoTA-lk6YWiibKsBVm8XQFOeeX3uPqiaIbyQbvJb_BnXihynR-MAqJDTO2c-xJtrNxXsOchkIfUJMrwNXb2aCdsimJpbQZsqfTgl0kxcMoxkauXCmqIFKEaQ-bSaWP9a2gbAwG8h2AeHaUZ6zP1OwFEfoQ',
  },
  {
    id: 'coca-cola',
    categoryId: 'drinks',
    name: 'Coca-Cola Lata',
    description: 'Lata 350ml',
    price: 6.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDb-GR6uMhC_gj2pZiaF5VUtz3ayU1QDxGf8-6SZ-RHd_ztojI3SBvMtuUdzyTLfN5G6OEeptAuc7WRMWfR58G7xJazF-XZxFgt-aBU0sKLeWp5DoKJHLxnPVBTiWPoPaJ27if46-uv6TVLz9tO5MVGmRwMnGB9sIPlSbvOBGwHM6GKIbKGWkhSR_UgDtUFbDsIIP6m5CTs4Mpl8Ah9fCIGRdpAGae9lpT6KRpzAsgUSvY83LQCIlrzwjkaMsoQPbL_FpdwuTXJw',
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '1234',
    date: '25 de Outubro, 19:45',
    status: OrderStatus.PREPARING,
    total: 35.5,
    items: [],
  },
  {
    id: '1233',
    date: '24 de Outubro, 20:15',
    status: OrderStatus.READY,
    total: 25.0,
    items: [],
  },
  {
    id: '1232',
    date: '22 de Outubro, 18:30',
    status: OrderStatus.DELIVERED,
    total: 42.8,
    items: [],
  },
  {
    id: '1231',
    date: '21 de Outubro, 12:05',
    status: OrderStatus.CANCELLED,
    total: 18.0,
    items: [],
  },
];
