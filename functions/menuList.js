import Cache from 'node-cache';
const foodCache = new Cache()

export default async function getMenuList(date, cafe = "upper-school") {
    const Now = date ? new Date(date) : new Date()
    const formattedDate = `${Now.getFullYear()}-${(Now.getMonth() + 1).toString().padStart(2, "0")}-${Now.getDate().toString().padStart(2, "0")}`
    let days;
    days = foodCache.get(`${formattedDate}-${cafe}`);
    if (days == undefined) {
        try {
            const food = await fetch(`https://woodward.api.nutrislice.com/menu/api/weeks/school/${cafe}/menu-type/lunch/${Now.getFullYear()}/${Now.getMonth() + 1}/${Now.getDate()}`)
            days = (await food.json()).days;
            foodCache.set(`${formattedDate}-${cafe}`, days, 6000)
        } catch (_) {
            return [{type: 'title', text: 'No data available'}]
        }
    }
    const filteredDay = days.filter(e => {
        return e.date == (formattedDate)
    })[0];
    const items = filteredDay?.menu_items || []
    const desiredCategories = new Set(["ENTREES", "DESSERT", "SIDES", "DESSERTS"])
    const filteredItems = [];
    let categoryWanted = false;
    items.forEach(e => {
        if (e.is_section_title) {
            if (desiredCategories.has(e.text)) {
                categoryWanted = true;
                filteredItems.push(e)
            } else {
                categoryWanted = false;
            }
        } else if (categoryWanted && !e.no_line_break) {
            filteredItems.push(e)
        }

    })
    const list = filteredItems.map(e => {
        const a = {};
        if (e.is_section_title) {
            a.type = "title"
        } else {
            a.type = "entry"
        }
        a.text = e.text || e.food?.name;
        return a;
    })
    return list.length != 0 ? list : [{type: 'title', text: 'No data available'}]
}