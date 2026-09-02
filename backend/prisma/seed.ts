import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

enum EtatMarche {
  PREPARATION = 'PREPARATION',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  CLOTURE = 'CLOTURE'
}

const prisma = new PrismaClient();

async function main() {
  // Purger la base de données existante
  await prisma.decomposition.deleteMany({});
  await prisma.libelleProduction.deleteMany({});
  await prisma.ouvrage.deleteMany({});
  await prisma.serie.deleteMany({});
  await prisma.marche.deleteMany({});

  console.log('Seeding construction market ERP data...');

  let adminUser = await prisma.user.findFirst();
  if (!adminUser) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    adminUser = await prisma.user.create({
      data: {
        nom: 'Admin',
        prenom: 'System',
        email: 'admin@system.com',
        passwordHash,
      },
    });
  }

  // 1. Création des Marchés
  const marche1 = await prisma.marche.create({
    data: {
      codeAffaire: 'CA-2026-001',
      numeroMarche: 'M-987654',
      maitreOuvrage: 'Habitat Modern SAS',
      partenaire: 'BTP Alliance',
      dateOSCommencement: new Date('2026-03-01'),
      delaiProjetMois: 18,
      etat: EtatMarche.EN_COURS,
      userId: adminUser.id,
    },
  });

  const marche2 = await prisma.marche.create({
    data: {
      codeAffaire: 'CA-2026-002',
      numeroMarche: 'M-123456',
      maitreOuvrage: 'Ville de Paris - Direction Logement',
      partenaire: 'Eiffage & Fils',
      dateOSCommencement: new Date('2026-09-01'),
      delaiProjetMois: 12,
      etat: EtatMarche.PREPARATION,
      userId: adminUser.id,
    },
  });

  const marche3 = await prisma.marche.create({
    data: {
      codeAffaire: 'CA-2026-003',
      numeroMarche: 'M-456789',
      maitreOuvrage: 'Promoteur Rive Gauche',
      partenaire: 'BTP Alliance',
      dateOSCommencement: new Date('2025-01-10'),
      delaiProjetMois: 24,
      etat: EtatMarche.TERMINE,
      userId: adminUser.id,
    },
  });

  // 2. Création des Séries pour le Marché 1 (En cours)
  const serie1 = await prisma.serie.create({
    data: {
      code: 'S-10',
      serie: 'Terrassement & Fondations',
      unite: 'U',
      quantite: 1,
      puMarcheHT: 45000,
      pptMarcheHT: 45000,
      marcheId: marche1.id,
    },
  });

  const serie2 = await prisma.serie.create({
    data: {
      code: 'S-20',
      serie: 'Gros Œuvre & Maçonnerie',
      unite: 'U',
      quantite: 1,
      puMarcheHT: 125000,
      pptMarcheHT: 125000,
      marcheId: marche1.id,
    },
  });

  // 3. Création des Ouvrages pour le Marché 1
  // Série 1
  const ouvrage1 = await prisma.ouvrage.create({
    data: {
      code: 'O-101',
      numeroPrixBordereau: 'B-1.1',
      ouvrage: 'Fouille en pleine masse dans le terrain',
      unite: 'm3',
      quantite: 1200,
      puMarcheHT: 12.0,
      pptMarcheHT: 14400,
      puRevientReference: 9.5,
      pptRevientReference: 11400,
      serieId: serie1.id,
    },
  });

  const ouvrage2 = await prisma.ouvrage.create({
    data: {
      code: 'O-102',
      numeroPrixBordereau: 'B-1.2',
      ouvrage: 'Béton de propreté sous semelles',
      unite: 'm3',
      quantite: 45,
      puMarcheHT: 95.0,
      pptMarcheHT: 4275,
      puRevientReference: 80.0,
      pptRevientReference: 3600,
      serieId: serie1.id,
    },
  });

  // Série 2
  const ouvrage3 = await prisma.ouvrage.create({
    data: {
      code: 'O-201',
      numeroPrixBordereau: 'B-2.1',
      ouvrage: 'Béton armé pour semelles de fondation',
      unite: 'm3',
      quantite: 180,
      puMarcheHT: 280.0,
      pptMarcheHT: 50400,
      puRevientReference: 230.0,
      pptRevientReference: 41400,
      serieId: serie2.id,
    },
  });

  const ouvrage4 = await prisma.ouvrage.create({
    data: {
      code: 'O-202',
      numeroPrixBordereau: 'B-2.2',
      ouvrage: 'Murs en agglos de 20x20x50 creux',
      unite: 'm2',
      quantite: 650,
      puMarcheHT: 72.0,
      pptMarcheHT: 46800,
      puRevientReference: 58.0,
      pptRevientReference: 37700,
      serieId: serie2.id,
    },
  });

  // 4. Création des Libellés de Production
  // Ouvrage O-101 (Fouille)
  const lp1 = await prisma.libelleProduction.create({
    data: {
      code: 'LP-1011',
      numeroPrixUnitaire: 'PU-1.1.1',
      cleRepartition: 'GC',
      libelleProduction: 'Terrassement mécanique pelle 20 tonnes',
      unite: 'm3',
      quantite: 1200,
      puMarcheHT: 12.0,
      pptMarcheHT: 14400,
      puRevientReference: 9.5,
      pptRevientReference: 11400,
      puProduction: 0,
      pptProduction: 0,
      ouvrageId: ouvrage1.id,
    },
  });

  // Ouvrage O-102 (Béton propreté)
  const lp2 = await prisma.libelleProduction.create({
    data: {
      code: 'LP-1021',
      numeroPrixUnitaire: 'PU-1.2.1',
      cleRepartition: 'ETU',
      libelleProduction: 'Coulage béton de propreté centrale',
      unite: 'm3',
      quantite: 45,
      puMarcheHT: 95.0,
      pptMarcheHT: 4275,
      puRevientReference: 80.0,
      pptRevientReference: 3600,
      puProduction: 0,
      pptProduction: 0,
      ouvrageId: ouvrage2.id,
    },
  });

  // Ouvrage O-201 (Béton semelles)
  const lp3 = await prisma.libelleProduction.create({
    data: {
      code: 'LP-2011',
      numeroPrixUnitaire: 'PU-2.1.1',
      cleRepartition: 'ELE', // 70% du volume en béton classique
      libelleProduction: 'Bétonnage semelle de fondation C25/30',
      unite: 'm3',
      quantite: 126, // 180 * 0.7
      puMarcheHT: 280.0,
      pptMarcheHT: 35280,
      puRevientReference: 230.0,
      pptRevientReference: 28980,
      puProduction: 0,
      pptProduction: 0,
      ouvrageId: ouvrage3.id,
    },
  });

  const lp4 = await prisma.libelleProduction.create({
    data: {
      code: 'LP-2012',
      numeroPrixUnitaire: 'PU-2.1.2',
      cleRepartition: 'EQ', // 30% du volume en armatures acier associées
      libelleProduction: 'Aciers façonnés HA pour fondations',
      unite: 'kg',
      quantite: 4500, // Ratio acier: ~83kg/m3 de béton restant
      puMarcheHT: 2.8,
      pptMarcheHT: 12600,
      puRevientReference: 2.2,
      pptRevientReference: 9900,
      puProduction: 0,
      pptProduction: 0,
      ouvrageId: ouvrage3.id,
    },
  });

  // 5. Création des Décompositions (éléments de prix)
  // Décompositions pour LP-1011 (Fouille)
  const decs_lp1 = [
    {
      code: 'DEC-1011-01',
      unite: 'h',
      libelleElement: 'Pelle hydraulique 20T + chauffeur',
      uniteControle: 'h',
      section: 'MATERIEL',
      quantite: 0.05,
      prixUnitaire: 110,
    },
    {
      code: 'DEC-1011-02',
      unite: 'h',
      libelleElement: 'Chef d\'équipe terrassement',
      uniteControle: 'h',
      section: 'MAIN D\'OEUVRE',
      quantite: 0.03,
      prixUnitaire: 38,
    },
    {
      code: 'DEC-1011-03',
      unite: 'h',
      libelleElement: 'Manœuvre de chantier',
      uniteControle: 'h',
      section: 'MAIN D\'OEUVRE',
      quantite: 0.04,
      prixUnitaire: 26,
    },
    {
      code: 'DEC-1011-04',
      unite: 'L',
      libelleElement: 'Gazole engin de chantier',
      uniteControle: 'L',
      section: 'MATERIAUX',
      quantite: 0.5,
      prixUnitaire: 1.8,
    },
  ];

  // Décompositions pour LP-1021 (Béton propreté)
  const decs_lp2 = [
    {
      code: 'DEC-1021-01',
      unite: 'm3',
      libelleElement: 'Béton C12/15 livré centrale',
      uniteControle: 'm3',
      section: 'MATERIAUX',
      quantite: 1.05, // 5% de perte
      prixUnitaire: 68,
    },
    {
      code: 'DEC-1021-02',
      unite: 'h',
      libelleElement: 'Ouvrier qualifié - coulage',
      uniteControle: 'h',
      section: 'MAIN D\'OEUVRE',
      quantite: 0.25,
      prixUnitaire: 30,
    },
    {
      code: 'DEC-1021-03',
      unite: 'u',
      libelleElement: 'Consommables divers (polyane, etc.)',
      uniteControle: 'm2',
      section: 'MATERIAUX',
      quantite: 1.1,
      prixUnitaire: 1.5,
    },
  ];

  // Décompositions pour LP-2011 (Béton semelles)
  const decs_lp3 = [
    {
      code: 'DEC-2011-01',
      unite: 'm3',
      libelleElement: 'Béton C25/30 auto-plaçant toupie',
      uniteControle: 'm3',
      section: 'MATERIAUX',
      quantite: 1.03,
      prixUnitaire: 115,
    },
    {
      code: 'DEC-2011-02',
      unite: 'h',
      libelleElement: 'Équipe de coulage semelles',
      uniteControle: 'h',
      section: 'MAIN D\'OEUVRE',
      quantite: 0.75,
      prixUnitaire: 45,
    },
    {
      code: 'DEC-2011-03',
      unite: 'h',
      libelleElement: 'Grue à tour de chantier (part)',
      uniteControle: 'h',
      section: 'MATERIEL',
      quantite: 0.15,
      prixUnitaire: 95,
    },
    {
      code: 'DEC-2011-04',
      unite: 'u',
      libelleElement: 'Bois de coffrage et accessoires',
      uniteControle: 'm2',
      section: 'MATERIAUX',
      quantite: 0.45,
      prixUnitaire: 12,
    },
  ];

  // Décompositions pour LP-2012 (Aciers HA)
  const decs_lp4 = [
    {
      code: 'DEC-2012-01',
      unite: 'kg',
      libelleElement: 'Acier HA en barres façonnées',
      uniteControle: 'kg',
      section: 'MATERIAUX',
      quantite: 1.05,
      prixUnitaire: 1.25,
    },
    {
      code: 'DEC-2012-02',
      unite: 'h',
      libelleElement: 'Ferrailleur compagnon',
      uniteControle: 'h',
      section: 'MAIN D\'OEUVRE',
      quantite: 0.015,
      prixUnitaire: 32,
    },
    {
      code: 'DEC-2012-03',
      unite: 'kg',
      libelleElement: 'Fil de ligature, cales d\'enrobage',
      uniteControle: 'kg',
      section: 'MATERIAUX',
      quantite: 0.02,
      prixUnitaire: 3.5,
    },
  ];

  // Insérer les décompositions et recalculer les montants
  const insertDecomposition = async (lpId: string, list: any[]) => {
    let puProduction = 0;
    for (const d of list) {
      const montant = d.quantite * d.prixUnitaire;
      puProduction += montant;
      await prisma.decomposition.create({
        data: {
          code: d.code,
          unite: d.unite,
          libelleElement: d.libelleElement,
          uniteControle: d.uniteControle,
          section: d.section,
          quantite: d.quantite,
          prixUnitaire: d.prixUnitaire,
          montant,
          libelleProductionId: lpId,
        },
      });
    }

    const lp = await prisma.libelleProduction.findUnique({ where: { id: lpId } });
    if (lp) {
      const pptProduction = lp.quantite * puProduction;
      await prisma.libelleProduction.update({
        where: { id: lpId },
        data: {
          puProduction,
          pptProduction,
        },
      });
    }
  };

  await insertDecomposition(lp1.id, decs_lp1);
  await insertDecomposition(lp2.id, decs_lp2);
  await insertDecomposition(lp3.id, decs_lp3);
  await insertDecomposition(lp4.id, decs_lp4);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
