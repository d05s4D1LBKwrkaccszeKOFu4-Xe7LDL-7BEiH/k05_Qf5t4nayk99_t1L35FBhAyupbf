//const TILE_SERVER = 'http://localhost:7800';
const PMTILES_PATH = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/tiles/';
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const fieldAliases = {
    'level': 'Этажность', 'address': 'Адрес', 'status': 'Тип', 
    'year': 'Год постройки', 'material': 'Материал', 'name': 'Название',
    'score_renov': 'Потенциал Реновации', 'score_modern': 'Потенциал Модернизации',
    'popul': 'Население', 'morphotype': 'Тип застройки',
    'area': 'Площадь района (га)', 'density_popul': 'Плотность населения',
    'density_rds': 'Плотность УДС (км/км2)', 'crime_density': 'Плотность преступлений',
    'mkrn_name': 'Название района', 'density_gsi': 'Плотность застройки',
    'pricepersqm_avg': 'Цена за м²',
    'renov': 'Реновация', 'modern': 'Модернизация'
};

const descriptions = {
    level: "Большая часть городской территории занята домами 1–5 этажей (светло-розовые  и розовые участки). Высотки (от 12 этажей) — редкость и находятся только в ограниченных зонах, вероятно, вблизи ключевых транспортных узлов или административных центров.",
    year: "Центр города сформирован преимущественно зданиями советских лет (1957–1984) - это самый старый жилой фонд, который задает историческое и культурное ядро города. Спальные районы располагаются на северо - востоке и юго - западе. Эти кварталы появились волнами - от более ранних до позднесоветских и постсоветских застроек, что хорошо заметно по смене оттенков на карте. Здесь преобладает массовое жилищное строительство, рассчитанное на большие группы населения. Современный район на севере — самый новый и быстрорастущий, представлен крупными кварталами новостроек последних десятилетий. Это свидетельствует о смещении градостроительных акцентов и о развитии новых жилых массивов на свободных территориях",
    status: "Распределение по типам застройки: ИЖС, МЖК и коммерция.",
    cadastre: "На долю инфраструктурных объектов (дороги, коммуникации, ЛЭП) приходится 38.3% площади, а на промышленные и производственные зоны — 27.8%. Вместе эти две категории составляют две трети всего земельного фонда, что характеризует территорию как значимый промышленный и логистический узел. При этом земли, непосредственно используемые населением для жизни и досуга, такие как жилая застройка (7.9%), парковые территории и садоводство (7.5%) и коммерция (6.0%), занимают значительно меньшую долю общей площади, что говорит о более интенсивном и концентрированном характере их использования.",
    density_popul: "Частный сектор между многоэтажными районами создает разрывы и препятствия в городской структуре. ИЖС сдерживает уплотнение и развитие центра, снижая эффективность использования дорогой городской земли. Для устойчивого городского развития такие разрывы нуждаются в реновации: можно создавать парки с общественной функцией, строить новые жилые или коммерческие здания, организовывать общественные пространства, которые бы «сшивали» ткани города и повышали человеческую активность на этих участках.",
    density_gsi: "Для города характерна сильная неоднородность по площади застройки разных участков. Высокий GSI не всегда означает интенсивную городскую жизнь: часто это промзоны или склады. Самые “жизненно насыщенные” участки — там, где высокий GSI совпадает с высокой плотностью населения и этажностью зданий. Видны участки для реновации, “разрывы” городской ткани, а также перспективные направления для рационального уплотнения городской структуры. Карта отлично подходит для начального анализа потенциала развития и выявления зон, требующих улучшения или комплексной реконструкции.",
    density_rds: "Улично-дорожная сеть в целом отражает этапность и специфику развития города: хорошую структуру в центре, достаточно рациональная сетка и новые районы с тенденцией к фрагментации и малой связанности. Ключевые проблемы: 1. Часть старых районов страдает от устаревшей инфраструктуры, которая не соответствует современным транспортным потокам. 2. Новые кварталы часто имеют слабую интеграцию с остальным городом, а транспортная сетка выполнена формально, что снижает связанность городской среды. 3. В промышленной периферии и транзитных зонах УДС становится барьером для пешеходов и городского развития.",
    transport: "Сеть общественного транспорта достаточно развита по основным магистралям и обеспечивает связность между крупными районами города, но слабо обрабатывает внутренние связи и окраины. 1. Жителям многих районов сложно пользоваться ОТ без лишних пересадок. 2. Текущая структура снижает транспортную гибкость и - на перспективу - требует развития локальных маршрутов, улучшения проникновения в глубокие и новые жилые массивы, а также интеграции с другими видами городской мобильности (пешие, велосипедные связи). 3 .Особое внимание стоит уделить развивающимся новым районам и зонам разрывов городской ткани, чтобы не допустить транспортной изоляции отдельных кварталов",
    crime_density: "Криминальная активность в городе наиболее выражена в наиболее насыщенных и транзитных районах - центр, крупные жилые массивы и ключевые транспортные коридоры. Малонаселенные и периферийные зоны остаются относительно спокойными. Это типичная ситуация для большинства городов: уровень правонарушений тесно зависит от концентрации людей и активности пространства. Для повышения безопасности в “красных” зонах необходим комплекс мер: развитие городской среды, освещение, видеонаблюдение, вовлечение людей в общественную жизнь и развитие инфраструктуры контроля.",
    crime_heat: "В структуре преступности преобладают имущественные правонарушения. На долю краж (ст. 188) приходится 39,2%, на мошенничество – 33,6%, что в совокупности составляет 72,8% от общего числа зарегистрированных деяний. По отдельным составам преступлений, в частности по умышленному причинению вреда здоровью средней тяжести (ст. 107), основная масса фактов (более 400) квалифицирована по части 1, что свидетельствует о преобладании составов без отягчающих обстоятельств.",
    commercial: "Данный слой визуализирует плотность и распределение коммерческой инфраструктуры, разделяя городскую территорию на зоны в зависимости от интенсивности бизнес-процессов и доступности услуг для населения: 1. Низкая интенсивность (Окраины и частный сектор): Характеризует территории с рассредоточенным расположением объектов, ориентированных исключительно на базовые нужды жителей. В этих зонах выбор товаров ограничен, а доступ к полноценному сервису требует использования транспорта. 2. Средняя интенсивность (Жилые массивы и магистрали): Типична для спальных районов со средней этажностью, где коммерция формирует устойчивые узлы вдоль главных дорог. Здесь достигается баланс между жилой средой и торговыми функциями, обеспечивающий повседневный и периодический спрос в пределах пешей доступности. 3. Высокая интенсивность (Деловые и транспортные узлы): Охватывает исторический центр города и зоны влияния крупных транспортных хабов. Это территории с максимальной концентрацией разнообразных коммерческих объектов и пиковой проходимостью, формирующие основной экономический каркас города.",
    real_estate: "Недвижимость с высокой стоимостью сконцентрирована преимущественно в центре города и в районах новой застройки.",
    schools: "В основном нехватка объектов связана с интенсивным строительством жилья в новых районах, где жилые функции появляются раньше, чем успевает развиться социальная и коммерческая инфраструктура. В результате новые кварталы заселяются, а социальные объекты строятся с заметным опозданием.",
    detsad: "В основном нехватка объектов связана с интенсивным строительством жилья в новых районах, где жилые функции появляются раньше, чем успевает развиться социальная и коммерческая инфраструктура. В результате новые кварталы заселяются, а социальные объекты строятся с заметным опозданием.",
    medical: "В основном нехватка объектов связана с интенсивным строительством жилья в новых районах, где жилые функции появляются раньше, чем успевает развиться социальная и коммерческая инфраструктура. В результате новые кварталы заселяются, а социальные объекты строятся с заметным опозданием.",
    college: "В основном нехватка объектов связана с интенсивным строительством жилья в новых районах, где жилые функции появляются раньше, чем успевает развиться социальная и коммерческая инфраструктура. В результате новые кварталы заселяются, а социальные объекты строятся с заметным опозданием.",
    vuz: "В основном нехватка объектов связана с интенсивным строительством жилья в новых районах, где жилые функции появляются раньше, чем успевает развиться социальная и коммерческая инфраструктура. В результате новые кварталы заселяются, а социальные объекты строятся с заметным опозданием.",
    score_renov: "Потенциал сноса ветхого жилья (ИЖС -> МЖК).",
    score_modern: "Потенциал модернизации среды без сноса.",
    spsyntax_int: "Интеграция: глобальная доступность улицы.",
    spsyntax_ch: "Выбор: транзитный потенциал улицы."
};

const crimeHotspotsData = [
    { name: "Каирбекова – Текстильщиков", coords: [63.6800493, 53.2394460], text: "Следует расположить пункт полиции в районе с плохой репутацией отдельных жилых домов" },
    { name: "Центральный рынок", coords: [63.6449730, 53.2176678], text: "Район с активной уличной и внеуличной торговлей часто является местом высокой криминогенности" },
    { name: "Абая – Наримановская", coords: [63.6286329, 53.2012473], text: "Новый район с высокой плотностью населения и отдельные увеселительные заведения должны находиться под наблюдением" },
    { name: "Образовательный кластер", coords: [63.6121245, 53.1889429], text: "Места концентрации высших и специальных учебных заведений вкупе с торговыми центрами могут быть источниками криминогенности" },
    { name: "Автовокзал", coords: [63.5929743, 53.1708450], text: "Железнодорожные и автовокзалы традиционно считаются местом с высоким уровнем преступности" }
];

const layersConfig = {
    'cadastre': {
        source: 'plots', type: 'fill',
        paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.2, 'fill-outline-color': '#3b82f6' },
        legend: { type: 'color', color: '#3b82f6', label: 'Границы участков' },
        desc: descriptions.cadastre,
        chart: { labels: ["Инфраструктура", "Пром.", "Жилая", "Садоводство"], values: [7920, 5746, 1634, 1541], colors: ['#64748b', '#94a3b8', '#3b82f6', '#10b981'] }
    },
    'density_popul': {
        source: 'districts', type: 'fill',
        paint: { 'fill-opacity': 0.7, 'fill-color': ['step', ['get', 'density_popul'], '#f0f9ff', 20, '#bae6fd', 60, '#38bdf8', 150, '#0284c7', 300, '#0c4a6e'] },
        legend: { type: 'gradient-step', colors: ['#f0f9ff', '#0c4a6e'], labels: ['Низкая', 'Высокая'] }, desc: descriptions.density_popul
    },
    'crime_density': {
        source: 'districts', type: 'fill',
        paint: { 
            'fill-opacity': 0.7, 
            'fill-color': [
                'case',
                ['any', ['==', ['get', 'crime_density'], null], ['==', ['get', 'crime_density'], '']], 
                'rgba(128, 128, 128, 0.2)',
                ['step', ['to-number', ['get', 'crime_density']], '#fff5f0', 1.6, '#fcbba1', 4.4, '#fc9272', 8.8, '#fb6a4a', 16.8, '#de2d26', 26.4, '#a50f15']
            ]
        },
        legend: { type: 'gradient-step', colors: ['#fff5f0', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'], labels: ['0', '1.6', '4.4', '8.8', '16.8', '26.4+'] }, 
        desc: descriptions.crime_density
    },
    'crime_heat': {
        source: 'crime', type: 'heatmap',
        paint: {
            'heatmap-weight': 0.3, 'heatmap-intensity': 1, 'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 15, 16, 50],
            'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.2, '#ffe4e6', 0.5, '#f43f5e', 0.8, '#e11d48', 1, '#881337'],
            'heatmap-opacity': 0.8
        },
        legend: { type: 'gradient', colors: ['#ffe4e6', '#e11d48', '#881337'], min: 'Единичные', max: 'Очаги' },
        desc: descriptions.crime_heat,
        chart: { labels: ["Кража", "Мошенничество", "Хищение", "Наркотики"], values: [4701, 4025, 716, 480], colors: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'] }
    },
    'commercial': {
        source: 'poi', type: 'heatmap',
        paint: {
            'heatmap-weight': 0.05, 'heatmap-intensity': 1, 'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 15, 16, 45],
            'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.2, '#1e3a8a', 0.5, '#3b82f6', 0.8, '#93c5fd', 1, '#facc15'],
            'heatmap-opacity': 0.65
        },
        legend: { type: 'gradient', colors: ['#1e3a8a', '#3b82f6', '#facc15'], min: 'Мин', max: 'Макс' }, desc: descriptions.commercial
    },
    'real_estate': {
        source: 'districts', type: 'fill',
        paint: { 
            'fill-opacity': 0.7, 
            'fill-color': [
                'case',
                ['any', ['==', ['get', 'pricepersqm_avg'], null], ['==', ['get', 'pricepersqm_avg'], '']], 
                'rgba(128, 128, 128, 0.2)', 
                ['step', ['to-number', ['get', 'pricepersqm_avg']], '#ffffcc', 317000, '#a1dab4', 418000, '#41b6c4', 507000, '#2c7fb8', 634000, '#253494']
            ]
        },
        legend: { type: 'gradient-step', colors: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'], labels: ['<317k', '317k', '418k', '507k', '634k+'] }, 
        desc: descriptions.real_estate
    },
    'level': {
        source: 'builds', type: 'fill-extrusion',
        paint: { 
            'fill-extrusion-color': ['step', ['get', 'level'], '#f1f5f9', 2, '#e2e8f0', 5, '#cbd5e1', 9, '#94a3b8'],
            'fill-extrusion-height': ['*', ['get', 'level'], 3.5], 
            'fill-extrusion-opacity': 0.8 
        },
        legend: { type: 'gradient-step', colors: ['#f1f5f9', '#94a3b8'], labels: ['1-2 эт.', '10+ эт.'] }, desc: descriptions.level
    },
    'year': {
        source: 'builds', type: 'fill-extrusion',
        paint: { 
            'fill-extrusion-color': [
                'case',
                ['any', ['==', ['get', 'year'], null], ['==', ['get', 'year'], '']], '#e5e7eb',
                ['step', ['to-number', ['get', 'year']], '#d1d5db', 1960, '#a5b4fc', 1980, '#818cf8', 2000, '#6366f1', 2020, '#4338ca']
            ],
            'fill-extrusion-height': ['*', ['get', 'level'], 3.5], 
            'fill-extrusion-opacity': 0.8 
        },
        legend: { type: 'gradient', colors: ['#d1d5db', '#4338ca'], min: 'Старые', max: 'Новые' }, desc: descriptions.year
    },
    'status': {
        source: 'builds', type: 'fill-extrusion',
        paint: {
            'fill-extrusion-color': [
                'match', ['get', 'status'],
                'многоквартирный жилой', '#b79983', 'индивидуальный жилой', '#a1b7cc', 'нежилой', '#D0D3D4', 'строящийся', '#decd88', '#cbd5e1'
            ],
            'fill-extrusion-height': ['*', ['get', 'level'], 3.5], 'fill-extrusion-opacity': 0.9
        },
        legend: {
            type: 'items',
            items: [{ color: '#b79983', label: 'МКЖ' }, { color: '#a1b7cc', label: 'ИЖС' }, { color: '#D0D3D4', label: 'Нежилые' }, { color: '#decd88', label: 'Стройка' }]
        },
        desc: descriptions.status
    },
    'density_gsi': {
        source: 'districts', type: 'fill',
        paint: { 
            'fill-opacity': 0.7, 
            'fill-color': [
                'case',
                ['any', ['==', ['get', 'density_gsi'], null], ['==', ['get', 'density_gsi'], '']], 
                'rgba(128, 128, 128, 0.2)',
                ['step', ['to-number', ['get', 'density_gsi']], '#f7f7f7', 0.058, '#cccccc', 0.132, '#969696', 0.192, '#636363', 0.344, '#252525']
            ]
        },
        legend: { type: 'gradient-step', colors: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'], labels: ['0', '0.058', '0.132', '0.192', '0.344', '0.767+'] }, 
        desc: descriptions.density_gsi
    },
    'density_rds': {
        source: 'districts', type: 'fill',
        paint: { 
            'fill-opacity': 0.7, 
            'fill-color': [
                'case',
                ['any', ['==', ['get', 'density_rds'], null], ['==', ['get', 'density_rds'], '']], 
                'rgba(128, 128, 128, 0.2)',
                ['step', ['to-number', ['get', 'density_rds']], '#f7f7f7', 4.1, '#cccccc', 12.2, '#969696', 26.6, '#636363', 51.5, '#252525']
            ]
        },
        legend: { type: 'gradient-step', colors: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'], labels: ['0', '4.1', '12.2', '26.6', '51.5', '88+'] }, 
        desc: descriptions.density_rds
    },
    'score_renov': {
        source: 'rm', type: 'fill',
        paint: { 'fill-color': ['interpolate', ['linear'], ['get', 'score_renov'], 0, '#fee2e2', 10, '#b91c1c'], 'fill-opacity': 0.7 },
        legend: { type: 'gradient', colors: ['#fee2e2', '#b91c1c'], min: '0', max: '10' }, desc: descriptions.score_renov
    },
    'score_modern': {
        source: 'rm', type: 'fill',
        paint: { 'fill-color': ['interpolate', ['linear'], ['get', 'score_modern'], 0, '#ecfdf5', 10, '#047857'], 'fill-opacity': 0.7 },
        legend: { type: 'gradient', colors: ['#ecfdf5', '#047857'], min: '0', max: '10' }, desc: descriptions.score_modern
    },
    'spsyntax_int': {
        source: 'spsyntax', type: 'line',
        paint: { 
            'line-width': 3, 
            'line-color': [
                'case',
                ['==', ['to-number', ['get', 'NAINr15000']], NaN], '#cccccc',
                ['step', ['to-number', ['get', 'NAINr15000']], '#440154', 0.207, '#3b528b', 0.624, '#21918c', 0.796, '#5ec962', 0.962, '#fde725']
            ]
        },
        legend: { type: 'gradient-step', colors: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'], labels: ['0.207', '0.624', '0.796', '0.962', '1.15', '1.455+'] },
        desc: descriptions.spsyntax_int
    },
    'spsyntax_ch': {
        source: 'spsyntax', type: 'line',
        paint: { 
            'line-width': 3, 
            'line-color': [
                'case',
                ['==', ['to-number', ['get', 'NAINr15000']], NaN], '#cccccc',
                ['step', ['to-number', ['get', 'NAINr15000']], '#440154', 0.207, '#3b528b', 0.624, '#21918c', 0.796, '#5ec962', 0.962, '#fde725']
            ]
        },
        legend: { type: 'gradient-step', colors: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'], labels: ['0', '0.259', '0.689', '0.958', '1.176', '1.539+'] },
        desc: descriptions.spsyntax_ch
    },
    'transport': {
        source: 'bus_routes', type: 'line',
        paint: { 'line-color': '#3b82f6', 'line-width': 4, 'line-opacity': 0.25 },
        legend: { type: 'items', items: [{color:'#3b82f6', label:'Маршрут'}, {color:'#64748b', label:'Остановка'}] }, desc: descriptions.transport
    }
};

let myChart = null;
let renovDataListener = null;

const map = new maplibregl.Map({
    container: 'map',
    style: {
        'version': 8,
        'sources': {
            'carto': { 'type': 'raster', 'tiles': ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'], 'tileSize': 256, 'attribution': '&copy; CARTO' },
            'google_sat': { 'type': 'raster', 'tiles': ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'], 'tileSize': 256, 'attribution': '&copy; Google' }
        },
        'layers': [
            { 'id': 'basemap-sat', 'type': 'raster', 'source': 'google_sat', 'layout': {'visibility': 'none'} },
            { 'id': 'basemap-scheme', 'type': 'raster', 'source': 'carto', 'layout': {'visibility': 'visible'} }
        ]
    },
    center: [63.63, 53.21], zoom: 12, pitch: 45
});

window.switchBasemap = function(type) {
    const isScheme = type === 'scheme';
    map.setLayoutProperty('basemap-scheme', 'visibility', isScheme ? 'visible' : 'none');
    map.setLayoutProperty('basemap-sat', 'visibility', isScheme ? 'none' : 'visible');
    document.getElementById('btn-scheme').classList.toggle('active', isScheme);
    document.getElementById('btn-sat').classList.toggle('active', !isScheme);
};

map.on('load', async () => {
    const image = await map.loadImage('https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png');
    if (image) map.addImage('custom-marker', image.data);

function addSrc(name) {
    map.addSource(name, {
        type: 'vector',
        url: `pmtiles://${PMTILES_PATH}${name}.pmtiles`,  // Пример: pmtiles://.../tiles/builds.pmtiles
        minzoom: 10,  // Твои зумы
        maxzoom: 16
    });
}
            // function addSrc(name) {
            //     map.addSource(name, { 'type': 'vector', 'tiles': [`${TILE_SERVER}/public.${name}/{z}/{x}/{y}.pbf`] });
            // }
    // Здесь 'renovatio' должен быть в списке!
    ['builds', 'plots', 'districts', 'rm', 'renovatio', 'spsyntax', 'bus_routes', 'bus_stops', 'crime', 'poi', 'schools', 'medical', 'detsad', 'college', 'vuz'].forEach(addSrc);

    // Зоны обслуживания
    map.addLayer({
        'id': 'layer-schools-zone', 'type': 'circle', 'source': 'schools', 'source-layer': 'schools',
        'layout': { 'visibility': 'none' },
        'paint': { 'circle-color': '#2563eb', 'circle-opacity': 0.15, 'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 12, 22, 16, 350], 'circle-pitch-alignment': 'map' }
    });
    map.addLayer({
        'id': 'layer-detsad-zone', 'type': 'circle', 'source': 'detsad', 'source-layer': 'detsad',
        'layout': { 'visibility': 'none' },
        'paint': { 'circle-color': '#f97316', 'circle-opacity': 0.15, 'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 12, 13, 16, 208], 'circle-pitch-alignment': 'map' }
    });

    // Создание слоев из конфига
// Замените 'source-layer': `public.${conf.source}` на 'source-layer': conf.source
for (const [metric, conf] of Object.entries(layersConfig)) {
    const layerOptions = {
        'id': `layer-${metric}`, 
        'type': conf.type, 
        'source': conf.source, 
        'source-layer': conf.source, // ТУТ: убрали public.
        'layout': { 'visibility': 'none' }, 
        'paint': conf.paint
    };
    map.addLayer(layerOptions);
}

    // Доп. слои
    map.addLayer({ 'id': 'layer-bus_stops', 'type': 'circle', 'source': 'bus_stops', 'source-layer': 'bus_stops', 'layout': {'visibility': 'none'}, 'paint': { 'circle-radius': 4, 'circle-color': '#64748b' } });
    map.addLayer({ 'id': 'layer-districts-border', 'type': 'line', 'source': 'districts', 'source-layer': 'districts', 'layout': { 'visibility': 'none' }, 'paint': { 'line-color': '#94a3b8', 'line-width': 1 } });
    map.addLayer({ 'id': 'layer-transport-highlight', 'type': 'line', 'source': 'bus_routes', 'source-layer': 'bus_routes', 'paint': { 'line-color': '#facc15', 'line-width': 6 }, 'filter': ['==', 'name', ''] });

    // Иконки соц. объектов
// ИКОНКИ (Социалка) - исправлено для работы без PostGIS сервера
['schools', 'medical', 'detsad', 'college', 'vuz'].forEach(id => {
    const colorMap = {'schools':'#2563eb', 'medical':'#e11d48', 'detsad':'#f97316', 'college':'#4f46e5', 'vuz':'#7e22ce'};
    map.addLayer({
        'id': `layer-${id}`, 
        'type': 'circle', 
        'source': id, 
        'source-layer': id, // УБРАЛИ "public.", теперь просто id (например, 'schools')
        'layout': {'visibility': 'none'},
        'paint': { 
            'circle-radius': 6, 
            'circle-color': colorMap[id], 
            'circle-stroke-width': 1, 
            'circle-stroke-color': '#fff' 
        }
    });
});

// 1. Основная заливка (почти прозрачная)
map.addLayer({
    'id': 'layer-renovatio',
    'type': 'fill',
    'source': 'renovatio',
    'source-layer': 'renovatio',
    'layout': { 'visibility': 'none' },
    'paint': { 
        'fill-color': '#e11d48', 
        'fill-opacity': 0.05 // Почти прозрачный
    }
});

// 2. Выделенная граница
map.addLayer({
    'id': 'layer-renovatio-outline',
    'type': 'line',
    'source': 'renovatio',
    'source-layer': 'renovatio',
    'layout': { 'visibility': 'none' },
    'paint': {
        'line-color': '#e11d48',
        'line-width': 2, // Четкая граница
        'line-opacity': 0.8
    }
});

// 3. Слой подсветки активного полигона
map.addLayer({
    'id': 'layer-renovatio-highlight',
    'type': 'fill',
    'source': 'renovatio',
    'source-layer': 'renovatio',
    'layout': { 'visibility': 'none' },
    'paint': {
        'fill-color': '#e11d48',
        'fill-opacity': 0.4 // Яркая заливка для выделенного объекта
    },
    'filter': ['==', 'name', ''] // По умолчанию ничего не подсвечено
});

    reorderLayers();
    map.on('error', (e) => console.error('Map error:', e));

    // Подсветка
    map.addLayer({ 'id': 'highlight-builds', 'type': 'line', 'source': 'builds', 'source-layer': 'builds', 'paint': { 'line-color': '#ef4444', 'line-width': 3 }, 'filter': ['==', 'gid', -1] });
    map.addLayer({ 'id': 'highlight-plots', 'type': 'line', 'source': 'plots', 'source-layer': 'plots', 'paint': { 'line-color': '#ef4444', 'line-width': 3 }, 'filter': ['==', 'gid', -1] });
    map.addLayer({ 'id': 'highlight-districts', 'type': 'line', 'source': 'districts', 'source-layer': 'districts', 'paint': { 'line-color': '#ef4444', 'line-width': 3 }, 'filter': ['==', 'gid', -1] });
    map.addLayer({ 'id': 'highlight-rm', 'type': 'line', 'source': 'rm', 'source-layer': 'rm', 'paint': { 'line-color': '#ef4444', 'line-width': 3 }, 'filter': ['==', 'gid', -1] });

    // --- Логика клика (Popup) ---
    map.on('click', (e) => {
        ['highlight-builds', 'highlight-plots', 'highlight-districts', 'highlight-rm'].forEach(l => { if (map.getLayer(l)) map.setFilter(l, ['==', 'gid', -1]); });
        const features = map.queryRenderedFeatures(e.point);
        if (!features.length) return;
        
        const feature = features[0];
        const props = feature.properties;
        const layerId = feature.layer.id;
        if (layerId.includes('-zone')) return;

        const objectId = props.gid || props.fid || props.id;
        if (objectId) {
            const idField = props.hasOwnProperty('gid') ? 'gid' : (props.hasOwnProperty('fid') ? 'fid' : 'id');
            if (layerId.includes('builds') || layerId.includes('level') || layerId.includes('year') || layerId.includes('status')) map.setFilter('highlight-builds', ['==', idField, objectId]);
            else if (layerId.includes('cadastre') || layerId.includes('plots')) map.setFilter('highlight-plots', ['==', idField, objectId]);
            else if (layerId.includes('density') || layerId.includes('real_estate')) map.setFilter('highlight-districts', ['==', idField, objectId]);
            else if (layerId.includes('score_') || layerId.includes('rm')) map.setFilter('highlight-rm', ['==', idField, objectId]);
        }

        let content = `<div class="popup-header">Инфо</div><div class="popup-body">`;
        if (layerId.includes('score_') || layerId.includes('rm')) {
            content += `
                <div class="popup-rm-header">Потенциал</div>
                <table class="popup-rm-table">
                    <tr>
                        <td>${fieldAliases['score_renov']}<br><b>${props.score_renov || 0}</b></td>
                        <td>${fieldAliases['score_modern']}<br><b>${props.score_modern || 0}</b></td>
                    </tr>
                </table>
                <div class="popup-rm-header" style="margin-top:8px;">Статус</div>
                <table class="popup-rm-table">
                    <tr>
                        <td class="${props.renov ? 'bg-renov' : ''}">${props.renov || '-'}</td>
                        <td class="${props.modern ? 'bg-modern' : ''}">${props.modern || '-'}</td>
                    </tr>
                </table>`;
        } else {
            content += `<table class="popup-table">`;
            for(let key in props) {
                if(!['gid','geom','objectid','fid'].includes(key) && props[key] !== null) {
                    let val = props[key];
                    if (key === 'area') val = (val / 10000).toFixed(1);
                    content += `<tr><td class="popup-key">${fieldAliases[key] || key}:</td><td class="popup-val">${val}</td></tr>`;
                }
            }
            content += `</table>`;
        }
        content += `</div>`;
        new maplibregl.Popup().setLngLat(e.lngLat).setHTML(content).addTo(map);
    });

    map.on('mouseenter', ['layer-level', 'layer-year', 'layer-score_renov'], () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', ['layer-level', 'layer-year', 'layer-score_renov'], () => map.getCanvas().style.cursor = '');

    // Инициализация контролов
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', (e) => {
            toggleLayer(e.target.dataset.metric, e.target.checked, e.target.dataset.type);
            updateGlobalCounter();
        });
    });

// Обработчик для всех кнопок .btn-toggle (включая Реновацию, Модернизацию и т.д.)
document.querySelectorAll('.btn-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const metric = btn.dataset.metric;
        const group = btn.dataset.group;
        const currentlyActive = btn.classList.contains('active');

        // Делаем эксклюзивность внутри группы (только одна активна)
        if (group) {
            document.querySelectorAll(`.btn-toggle[data-group="${group}"]`)
                .forEach(b => b.classList.remove('active'));
        }

        if (!currentlyActive) {
            btn.classList.add('active');
            toggleLayer(metric, true);   // ← вот это включает слой
        } else {
            btn.classList.remove('active');
            toggleLayer(metric, false);
        }

        updateGlobalCounter();
        updateUI(layersConfig[metric] || {}, metric);  // обновить описание/легенду
    });
});
});

function toggleLayer(metric, show, type) {
    if (layersConfig[metric]) {
        const layerId = `layer-${metric}`;
        if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', show ? 'visible' : 'none');
        
// --- ЛОГИКА ДЛЯ РЕНОВАЦИИ ---
if (metric === 'score_renov') {
            const visibility = show ? 'visible' : 'none';

            // 1. Управляем видимостью группы слоев (основной, границы, слой выделения)
            const renovLayers = ['layer-renovatio', 'layer-renovatio-outline', 'layer-renovatio-highlight'];
            renovLayers.forEach(id => {
                if (map.getLayer(id)) {
                    map.setLayoutProperty(id, 'visibility', visibility);
                }
            });

            const hs = document.getElementById('hotspotsContainer');
            if (show) {
                hs.style.display = 'block';
                
                // Функция сбора данных для кнопок
                const updateRenovData = () => {
                    // Ищем объекты в источнике renovatio
                    const features = map.querySourceFeatures('renovatio', {
                        sourceLayer: 'renovatio'
                    });

                    const uniquePoints = new Map();
                    features.forEach(f => {
                        const p = f.properties;
                        // Проверяем наличие полей: name, x, y
                        if (p.name && p.x && p.y) {
                            if (!uniquePoints.has(p.name)) {
                                uniquePoints.set(p.name, {
                                    name: p.name,
                                    coords: [parseFloat(p.x), parseFloat(p.y)], 
                                    text: p.text || 'Описание отсутствует'
                                });
                            }
                        }
                    });

                    // Рисуем кнопки из уникальных точек
                    renderHotspotsButtons(Array.from(uniquePoints.values()));
                };

                // Запускаем поиск данных сразу
                updateRenovData();
                
                // Обновляем список кнопок при дозагрузке карты (событие idle)
                if (renovDataListener) map.off('idle', renovDataListener);
                renovDataListener = updateRenovData;
                map.on('idle', renovDataListener);

            } else {
                // Если слой выключили — скрываем панель
                hs.style.display = 'none';

                // Сбрасываем фильтр подсветки, чтобы при следующем включении ничего не было выделено
                if (map.getLayer('layer-renovatio-highlight')) {
                    map.setFilter('layer-renovatio-highlight', ['==', 'name', '']);
                }

                // Удаляем слушатель обновлений
                if (renovDataListener) {
                    map.off('idle', renovDataListener);
                    renovDataListener = null;
                }
            }
        }
        
        // --- ПРЕСТУПНОСТЬ ---
        if (metric === 'crime_heat') {
            const hs = document.getElementById('hotspotsContainer');
            if (show) { hs.style.display = 'block'; renderHotspotsButtons(crimeHotspotsData); } 
            else { hs.style.display = 'none'; }
        }

        // --- ТРАНСПОРТ ---
        if (metric === 'transport') {
            if (map.getLayer('layer-bus_stops')) map.setLayoutProperty('layer-bus_stops', 'visibility', show ? 'visible' : 'none');
            document.getElementById('routes-panel').style.display = show ? 'flex' : 'none';
            if(show) loadBusRoutes();
        }

        if (show) updateUI(layersConfig[metric], metric);
    } 
    else if (type === 'social') {
        const layerId = `layer-${metric}`;
        if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', show ? 'visible' : 'none');
        if (metric === 'schools' && map.getLayer('layer-schools-zone')) map.setLayoutProperty('layer-schools-zone', 'visibility', show ? 'visible' : 'none');
        if (metric === 'detsad' && map.getLayer('layer-detsad-zone')) map.setLayoutProperty('layer-detsad-zone', 'visibility', show ? 'visible' : 'none');
        if (show) updateUI({ desc: descriptions[metric], legend: {type:'color', color:'#2563eb', label:'Объект'} }, metric);
    }
    reorderLayers();
}

function renderHotspotsButtons(data) {
    const container = document.getElementById('hotspotsButtons');
    const infoBox = document.getElementById('hotspotInfoText');
    
    container.innerHTML = '';
    infoBox.style.display = 'none';
    infoBox.innerText = '';

    if (!data || !data.length) return;
    
    // Сортируем кнопки по алфавиту
    data.sort((a, b) => a.name.localeCompare(b.name));

    data.forEach(spot => {
        const btn = document.createElement('button');
        btn.className = 'hotspot-btn';
        btn.innerText = spot.name;
        
        btn.onclick = () => {
            // 1. Перелет к координатам
            map.flyTo({ center: spot.coords, zoom: 16, pitch: 45, essential: true });
            
            // 2. Включаем подсветку конкретного полигона по имени
            map.setFilter('layer-renovatio-highlight', ['==', ['get', 'name'], spot.name]);
            
            // 3. Вывод текста описания
            infoBox.innerText = spot.text;
            infoBox.style.display = 'block';
            
            // 4. Визуальный стайл кнопки (активное состояние)
            document.querySelectorAll('.hotspot-btn').forEach(b => { 
                b.style.borderColor = '#e2e8f0'; 
                b.style.background = '#f8fafc'; 
                b.style.color = '#333';
            });
            document.querySelectorAll('.hotspot-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            btn.style.background = '#fff1f2'; 
            btn.style.color = '#be123c';
        };
        container.appendChild(btn);
    });
}

function updateUI(conf, metricKey) {
    if (!conf) return; // ЗАЩИТА ОТ ОШИБКИ map.js:721
    if (!conf.legend) return; // Доп. защита

    const descPanel = document.getElementById('descPanel');
    const descText = document.getElementById('descText');
    const descTitle = document.getElementById('descTitle');
    const descBtn = document.getElementById('descToggleBtn');

    const text = descriptions[metricKey] || conf.desc || '';
    if (text) {
        descPanel.style.display = 'block';
        descText.innerText = text;
        descTitle.innerText = conf.title || fieldAliases[metricKey] || 'Информация';
        descText.style.display = 'none'; 
        descBtn.innerText = '▼';
    } else {
        descPanel.style.display = 'none';
    }

    const leg = document.getElementById('legend');
    leg.style.display = 'block';
    if (conf.legend.type === 'gradient-step') {
        let html = `<div class="legend-labels">`;
        conf.legend.labels.forEach(l => html += `<span>${l}</span>`);
        html += `</div><div style="display:flex; height:10px; border-radius:5px; overflow:hidden; margin-top:5px;">`;
        conf.legend.colors.forEach(c => html += `<div style="flex:1; background:${c}"></div>`);
        html += `</div>`;
        leg.innerHTML = html;
    } else if (conf.legend.type === 'gradient') {
        leg.innerHTML = `<div class="legend-labels"><span>${conf.legend.min}</span><span>${conf.legend.max}</span></div>
                         <div class="legend-gradient" style="background: linear-gradient(to right, ${conf.legend.colors.join(',')}); height:10px; border-radius:5px; margin-top:5px;"></div>`;
    } else if (conf.legend.type === 'color') {
        leg.innerHTML = `<div class="legend-item"><div class="legend-color" style="background:${conf.legend.color}"></div>${conf.legend.label}</div>`;
    } else if (conf.legend.type === 'items') {
        let html = '';
        conf.legend.items.forEach(item => {
            html += `<div class="legend-item"><div class="legend-color" style="background:${item.color}"></div>${item.label}</div>`;
        });
        leg.innerHTML = html;
    }

// --- 3. ДИАГРАММА И ПАНЕЛЬ СТАТИСТИКИ ---
// --- 3. ДИАГРАММА И ПАНЕЛЬ СТАТИСТИКИ ---
    const chartPanel = document.getElementById('chartPanel');
    const hsContainer = document.getElementById('hotspotsContainer');
    
    // Получаем элементы графика и заглушки
    const canvas = document.getElementById('infoChart');
    const placeholder = document.getElementById('chartPlaceholder');

    // Сбрасываем отображение
    canvas.style.display = 'none';
    if(placeholder) placeholder.style.display = 'none';

    // Если есть данные для графика (conf.chart определен)
    if (conf.chart) {
        chartPanel.style.display = 'block'; 
        canvas.style.display = 'block'; // Показываем canvas
        
        if(myChart) myChart.destroy();
        
        const ctx = canvas; // Используем canvas напрямую
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: { 
                labels: conf.chart.labels, 
                datasets: [{ 
                    data: conf.chart.values, 
                    backgroundColor: conf.chart.colors 
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } 
                } 
            }
        });
    } else {
        // Если графика нет
        if (myChart) myChart.destroy();
        
        // Проверяем: если видны "горячие точки" (кнопки), то показываем панель с ЗАГЛУШКОЙ
        if (hsContainer.style.display === 'block') {
            chartPanel.style.display = 'block';
            if(placeholder) placeholder.style.display = 'flex'; // Показываем серый блок "Нет данных"
        } else {
            // Если нет ни графика, ни кнопок — скрываем панель совсем
            chartPanel.style.display = 'none';
        }
    }
}

function updateGlobalCounter() {
    let count = 0;
    document.querySelectorAll('input[type="checkbox"]').forEach(c => { if(c.checked) count++; });
    count += document.querySelectorAll('.btn-toggle.active').length;
    document.getElementById('layerCount').innerText = count;
    document.getElementById('resetAllBtn').style.display = count > 0 ? 'block' : 'none';
}

document.getElementById('resetAllBtn').addEventListener('click', () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => { if(c.checked) { c.checked = false; toggleLayer(c.dataset.metric, false, c.dataset.type); }});
    document.querySelectorAll('.btn-toggle.active').forEach(b => { b.classList.remove('active'); toggleLayer(b.dataset.metric, false); });
    updateGlobalCounter();
});

function loadBusRoutes() {
    const panel = document.getElementById('routes-panel');
    panel.innerHTML = ''; 
    const routes = ["1", "3", "5", "7", "8", "10", "11", "12", "13", "18", "18А", "19", "21", "24", "25", "27", "38", "42", "101", "101А", "102", "103", "104", "105", "107", "109", "110", "112", "113А", "116", "118", "120", "121"];
    routes.forEach(r => {
        const btn = document.createElement('div');
        btn.className = 'route-select-btn';
        btn.innerText = r;
        btn.onclick = () => {
            map.setFilter('layer-transport-highlight', ['==', 'name', r]);
            setTimeout(() => map.setFilter('layer-transport-highlight', ['==', 'name', '']), 3000);
        };
        panel.appendChild(btn);
    });
}

function reorderLayers() {
    const topLayers = [
        // 1. Сначала кладем слои Renovatio (они будут в самом низу, ПОД rm)
        'layer-renovatio', 
        'layer-renovatio-outline', 
        'layer-renovatio-highlight',

        // 2. Затем слой RM (score_renov), чтобы он перекрывал renovatio (как вы просили)
        'layer-score_renov', 
        'layer-score_modern',

        // 3. Остальные слои (будут поверх всего)
        'layer-level', 'layer-year', 'layer-status', 
        'highlight-builds', 'highlight-plots', 'highlight-districts', 'highlight-rm', 
        'layer-transport', 'layer-transport-highlight', 
        'layer-spsyntax', 
        'layer-schools', 'layer-medical', 'layer-detsad', 'layer-college', 'layer-vuz', 
        'layer-bus_stops'
    ];
    
    topLayers.forEach(id => { 
        if (map.getLayer(id)) map.moveLayer(id); 
    });
}

function toggleMenu() {
    document.getElementById('accordion').classList.toggle('collapsed-menu');
}

document.querySelectorAll('details').forEach((target) => {
    target.addEventListener('click', (e) => {
        if (!target.open) {
            document.querySelectorAll('details').forEach((detail) => { if (detail !== target) detail.removeAttribute('open'); });
        }
    });
});

function toggleChart() {
    document.getElementById('chartPanel').classList.toggle('chart-collapsed');
}

function toggleDescription() {
    const text = document.getElementById('descText');
    const btn = document.getElementById('descToggleBtn');
    if (text.style.display === 'none') {
        text.style.display = 'block';
        btn.innerText = '▲';
    } else {
        text.style.display = 'none';
        btn.innerText = '▼';
    }
}

function closeDescription() {
    document.getElementById('descPanel').style.display = 'none';
}