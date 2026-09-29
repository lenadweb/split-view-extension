export enum MenuId {
    LinkRight = 'link-right',
    LinkLeft = 'link-left',
    TabRight = 'tab-right',
    TabLeft = 'tab-left',
}

export const MENU_ITEMS: {
    id: MenuId;
    title: string;
    contexts: ['link' | 'tab'];
}[] = [
    { id: MenuId.LinkRight, title: 'contextLinkRight', contexts: ['link'] },
    { id: MenuId.LinkLeft, title: 'contextLinkLeft', contexts: ['link'] },
    { id: MenuId.TabRight, title: 'contextTabRight', contexts: ['tab'] },
    { id: MenuId.TabLeft, title: 'contextTabLeft', contexts: ['tab'] },
];
