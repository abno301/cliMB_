export interface Dogodek {
    ime: string,
    ura: string,
    vrsta: number,
    stolpec: number,
    barva?: string,
}

export interface Uporabnik {
    email: string,
    role: string,
    celodnevneKarte?: number,
    mesecnaKarta?: boolean,
    letnaKarta?: boolean,
    veljavnaDo?: Date
}