// بيانات أنواع العسل الستة
export const honeyTypes = [
    {
        id: 'lemon',
        name: 'عسل الليمون',
        nameEn: 'Lemon Honey',
        color: '#FCD34D',
        glowColor: '#FDE68A',
        description: 'عسل طبيعي من أزهار الليمون، غني بالفيتامينات',
        benefits: ['تقوية المناعة', 'مضاد للأكسدة', 'منعش ولذيذ'],
    },
    {
        id: 'thyme',
        name: 'عسل الزعتر',
        nameEn: 'Thyme Honey',
        color: '#D97706',
        glowColor: '#F59E0B',
        description: 'عسل الزعتر الجبلي الأصيل، معروف بفوائده العلاجية',
        benefits: ['مضاد للبكتيريا', 'يقوي الجهاز التنفسي', 'طعم مميز'],
    },
    {
        id: 'eucalyptus',
        name: 'عسل الكينا',
        nameEn: 'Eucalyptus Honey',
        color: '#10B981',
        glowColor: '#34D399',
        description: 'عسل الكينا المنعش، مثالي للجهاز التنفسي',
        benefits: ['يساعد على التنفس', 'مهدئ للسعال', 'منعش'],
    },
    {
        id: 'wildflower',
        name: 'عسل الزهور البرية',
        nameEn: 'Wildflower Honey',
        color: '#EC4899',
        glowColor: '#F472B6',
        description: 'عسل متنوع من مختلف الزهور البرية',
        benefits: ['غني بالمعادن', 'طعم متوازن', 'طبيعي 100%'],
    },
    {
        id: 'sidr',
        name: 'عسل السدر',
        nameEn: 'Sidr Honey',
        color: '#B45309',
        glowColor: '#D97706',
        description: 'عسل السدر الملكي، من أفخر أنواع العسل',
        benefits: ['قيمة غذائية عالية', 'يقوي المناعة', 'نادر وفاخر'],
    },
    {
        id: 'orange',
        name: 'عسل البرتقال',
        nameEn: 'Orange Blossom Honey',
        color: '#F97316',
        glowColor: '#FB923C',
        description: 'عسل أزهار البرتقال العطري',
        benefits: ['رائحة زكية', 'غني بفيتامين C', 'مهدئ للأعصاب'],
    },
];

// أوزان المنتجات المتاحة
export const availableWeights = [
    { value: '50g', label: '50 جرام', price: 50 },
    { value: '100g', label: '100 جرام', price: 90 },
    { value: '250g', label: '250 جرام', price: 200 },
    { value: '500g', label: '500 جرام', price: 380 },
    { value: '1kg', label: '1 كيلو', price: 700 },
];
