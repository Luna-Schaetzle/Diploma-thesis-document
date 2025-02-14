#!/bin/bash
# Build-Skript für LaTeX-Dokumente mit BibTeX-Unterstützung
# Verwendung:
#   ./build.sh [Hauptdateiname ohne .tex] 
# Falls kein Parameter angegeben wird, wird "diplomarbeit.tex" verwendet.

# Setze den Standard-Dateinamen (ohne Endung)
MAINFILE="main"

# Falls ein Parameter übergeben wurde, diesen verwenden
if [ "$1" != "" ]; then
    MAINFILE="$1"
fi

echo "Erstelle PDF für $MAINFILE.tex ..."

# Alte Build-Dateien entfernen (optional, aber empfehlenswert)
rm -f "$MAINFILE.aux" "$MAINFILE.bbl" "$MAINFILE.blg" "$MAINFILE.log" "$MAINFILE.out" "$MAINFILE.toc"

# Erster pdflatex-Durchlauf
pdflatex -interaction=nonstopmode "$MAINFILE.tex" | grep -v "Warning"

# BibTeX-Durchlauf (vorausgesetzt, in deinem Dokument wird auf Reference.bib verwiesen)
bibtex "$MAINFILE" | grep -v "Warning"

# Zweiter pdflatex-Durchlauf (für korrekte Verweise)
pdflatex -interaction=nonstopmode "$MAINFILE.tex" | grep -v "Warning"

# Dritter pdflatex-Durchlauf (zur finalen Auflösung aller Referenzen)
pdflatex -interaction=nonstopmode "$MAINFILE.tex" | grep -v "Warning"

echo "Build abgeschlossen. Das PDF findest du als $MAINFILE.pdf"
