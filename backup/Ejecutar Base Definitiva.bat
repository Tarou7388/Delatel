@echo off

REM Ruta al archivo .sql específico
SET "SQL_FILE=C:\xampp\htdocs\Delatel\app\DB\DATABASE.sql"
SET "SQL_FILE2=C:\xampp\htdocs\Delatel\app\DB\Registro_DepartamentoPronvinciaDistrito.sql"
SET "SQL_FILE3=C:\xampp\htdocs\Delatel\app\DB\Registros.sql"
SET "SQL_FOLDER=C:\xampp\htdocs\Delatel\app\DB\Procedimientos"
SET "MYSQL_PATH=C:\xampp\mysql\bin"
SET "USER=root"
SET "PASSWORD="
SET "DATABASE=Delatel"

echo La ruta del archivo SQL es: %SQL_FILE%

REM Asegúrate de que el comando mysql esté accesible
set PATH=%PATH%;%MYSQL_PATH%

REM Elimina la base de datos si existe
mysql -u "%USER%" -p"%PASSWORD%" -e "DROP DATABASE IF EXISTS %DATABASE%;"

REM Ejecuta el archivo SQL en la base de datos 'Delatel'
mysql -u "%USER%" -p"%PASSWORD%" < "%SQL_FILE%"

if ERRORLEVEL 1 (
    echo Error al ejecutar el archivo SQL.
) else (
    mysql -u "%USER%" -p"%PASSWORD%" < "%SQL_FILE2%"
	mysql -u "%USER%" -p"%PASSWORD%" < "%SQL_FILE3%"
	cd /d "%SQL_FOLDER%"
	for %%f in (*.sql) do (
    echo Ejecutando %%f...
    mysql -u "%USER%" -p"%PASSWORD%" "%DATABASE%" < "%%f"
    if ERRORLEVEL 1 (
        echo Error al ejecutar %%f
    ) else (
        echo %%f ejecutado correctamente.
    )
)
)

echo Proceso completado. Presiona cualquier tecla para salir.
pause
