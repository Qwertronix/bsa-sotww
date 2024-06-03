import { Settings } from "./Settings.js";

export class Adaption implements SystemApi {

    get version() {
        return 1;
    }

    get id() {
        return "wfrp4e";
    }

    async actorRollSkill(actor, skillId){
        const skills = actor.items.filter(i=>i.type === "skill" && i.name.toLowerCase() === skillId.toLowerCase())
        const test = await actor.setupSkill(skills[0]);
        await test.roll();
        const roll = await new Roll("1d100").roll({async:false});
        roll["_total"] = test.data.result.baseSL;
        return roll;
    }

    async actorRollAbility(actor, abilityId){
        return null
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string):void {
        const tabs = $(html).find('nav.tabs');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '" title="' + tabData.label + '">'+tabData.label+'</a>');
        tabs.append(tabItem);
        const body = $(html).find("section.content");
        const tabContent = $('<div class="tab beavers-crafting" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    itemSheetReplaceContent(app, html, element):void {
        const sheetBody = html.find('.wfrp4e.item-sheet');
        const header = sheetBody.find('header');
        const img = sheetBody.find(".item-image");
        sheetBody.empty();
        const x = $("<div class='flexrow'></div>");
        sheetBody.append(x);
        x.append(img);
        x.append(header);
        sheetBody.append(element);
    }

    get configAbilities(){
        return [];
    }

    get configSkills():SkillConfig[] {
        let pack = game['packs'].get('wfrp4e.basic')
        if (! pack){
            pack = game['packs'].get('wfrp4e-core.items')
        }
        let skills:SkillConfig[] = [];
        if(pack){
            skills = pack
                .index.filter(f=>f.type==="skill").map(skill=>{
                return {
                    id: skill.name,
                    label: skill.name
                }
            });
        }
        Settings.get(Settings.SKILLS).split(",").forEach(skill=>{
            skills.push({id:skill.trim(),label:skill.trim()})
        });
        return skills;
    }


    get configCurrencies():CurrencyConfig[] {
        return game['packs'].get('wfrp4e.basic')
            .index.filter(f=>f.type==="money").map(currency=>{
                let id = "bp";
                let factor = 1;
                if(currency.name === "Gold Crown"){
                    id = "gc";
                    factor = 240;
                }
                if(currency.name === "Silver Shilling"){
                    id = "ss";
                    factor = 12;
                }
                return {
                    id: id,
                    factor: factor,
                    label: currency.name,
                    uuid: currency.uuid
                }
            });
    }

    get configCanRollAbility():boolean {
        return false;
    }
    get configLootItemType(): string {
        return "trapping";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity.value";
    }
    async init(){

    }

}