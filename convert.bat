@echo off
echo Start converting MBTiles to PMTiles...

:: Создаем папку tiles, если её нет
if not exist "tiles" mkdir tiles

:: Основные слои (конвертируем из tiles_source в tiles)
pmtiles.exe convert ./tiles_source/renovatio.mbtiles ./tiles/renovatio.pmtiles
pmtiles.exe convert ./tiles_source/rm.mbtiles ./tiles/rm.pmtiles
pmtiles.exe convert ./tiles_source/builds.mbtiles ./tiles/builds.pmtiles
pmtiles.exe convert ./tiles_source/plots.mbtiles ./tiles/plots.pmtiles
pmtiles.exe convert ./tiles_source/districts.mbtiles ./tiles/districts.pmtiles
pmtiles.exe convert ./tiles_source/spsyntax.mbtiles ./tiles/spsyntax.pmtiles

:: Транспорт
pmtiles.exe convert ./tiles_source/bus_routes.mbtiles ./tiles/bus_routes.pmtiles
pmtiles.exe convert ./tiles_source/bus_stops.mbtiles ./tiles/bus_stops.pmtiles

:: Соц. объекты
pmtiles.exe convert ./tiles_source/schools.mbtiles ./tiles/schools.pmtiles
pmtiles.exe convert ./tiles_source/medical.mbtiles ./tiles/medical.pmtiles
pmtiles.exe convert ./tiles_source/detsad.mbtiles ./tiles/detsad.pmtiles
pmtiles.exe convert ./tiles_source/college.mbtiles ./tiles/college.pmtiles
pmtiles.exe convert ./tiles_source/vuz.mbtiles ./tiles/vuz.pmtiles

:: Остальные
pmtiles.exe convert ./tiles_source/crime.mbtiles ./tiles/crime.pmtiles
pmtiles.exe convert ./tiles_source/poi.mbtiles ./tiles/poi.pmtiles

echo.
echo Conversion finished!
pause