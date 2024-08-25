export interface Dogodek {
    ime: string,
    ura: string,
    vrsta: number,
    stolpec: number
}

export interface Uporabnik {
    email: string,
    role: string,
    celodnevneKarte?: number,
    mesecnaKarta?: boolean,
    letnaKarta?: boolean,
    veljavnaDo?: Date
}