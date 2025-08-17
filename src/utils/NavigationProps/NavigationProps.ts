interface Navigation {
     navigate: (screen: string, params?: object) => void;
     goBack: () => void;
     toggleDrawer: () => void;
}

export default Navigation;
