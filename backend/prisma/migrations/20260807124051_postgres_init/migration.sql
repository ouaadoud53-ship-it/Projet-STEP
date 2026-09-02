-- CreateTable
CREATE TABLE "Marche" (
    "id" TEXT NOT NULL,
    "codeAffaire" TEXT NOT NULL,
    "numeroMarche" TEXT NOT NULL,
    "maitreOuvrage" TEXT NOT NULL,
    "partenaire" TEXT NOT NULL,
    "dateOSCommencement" TIMESTAMP(3) NOT NULL,
    "delaiProjetMois" INTEGER NOT NULL,
    "etat" TEXT NOT NULL DEFAULT 'PREPARATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serie" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "puMarcheHT" DOUBLE PRECISION NOT NULL,
    "pptMarcheHT" DOUBLE PRECISION NOT NULL,
    "marcheId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ouvrage" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "numeroPrixBordereau" TEXT NOT NULL,
    "ouvrage" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "puMarcheHT" DOUBLE PRECISION NOT NULL,
    "pptMarcheHT" DOUBLE PRECISION NOT NULL,
    "puRevientReference" DOUBLE PRECISION NOT NULL,
    "pptRevientReference" DOUBLE PRECISION NOT NULL,
    "serieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ouvrage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibelleProduction" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "numeroPrixUnitaire" TEXT NOT NULL,
    "cleRepartition" DOUBLE PRECISION NOT NULL,
    "libelleProduction" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "puMarcheHT" DOUBLE PRECISION NOT NULL,
    "pptMarcheHT" DOUBLE PRECISION NOT NULL,
    "puRevientReference" DOUBLE PRECISION NOT NULL,
    "pptRevientReference" DOUBLE PRECISION NOT NULL,
    "puProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pptProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ouvrageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibelleProduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decomposition" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "libelleElement" TEXT NOT NULL,
    "uniteControle" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "libelleProductionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Decomposition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Marche_codeAffaire_key" ON "Marche"("codeAffaire");

-- CreateIndex
CREATE UNIQUE INDEX "Serie_code_key" ON "Serie"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Ouvrage_code_key" ON "Ouvrage"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LibelleProduction_code_key" ON "LibelleProduction"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Decomposition_code_key" ON "Decomposition"("code");

-- AddForeignKey
ALTER TABLE "Serie" ADD CONSTRAINT "Serie_marcheId_fkey" FOREIGN KEY ("marcheId") REFERENCES "Marche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ouvrage" ADD CONSTRAINT "Ouvrage_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibelleProduction" ADD CONSTRAINT "LibelleProduction_ouvrageId_fkey" FOREIGN KEY ("ouvrageId") REFERENCES "Ouvrage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decomposition" ADD CONSTRAINT "Decomposition_libelleProductionId_fkey" FOREIGN KEY ("libelleProductionId") REFERENCES "LibelleProduction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
