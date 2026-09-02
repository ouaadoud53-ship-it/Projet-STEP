export declare enum EtatMarche {
    PREPARATION = "PREPARATION",
    EN_COURS = "EN_COURS",
    TERMINE = "TERMINE",
    CLOTURE = "CLOTURE"
}
export declare class CreateMarcheDto {
    codeAffaire: string;
    numeroMarche: string;
    maitreOuvrage: string;
    partenaire: string;
    dateOSCommencement: string;
    delaiProjetMois: number;
    etat?: EtatMarche;
}
export declare class UpdateMarcheDto {
    codeAffaire?: string;
    numeroMarche?: string;
    maitreOuvrage?: string;
    partenaire?: string;
    dateOSCommencement?: string;
    delaiProjetMois?: number;
    etat?: EtatMarche;
}
