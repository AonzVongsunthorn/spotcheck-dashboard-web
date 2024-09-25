# spotcheck-dashboard-web
Spotcheck Dashboard Web base on `vue@3.x` wth [vuestic](https://vuestic.epicmax.co/admin/dashboard) for the core theme.

## Prerequitsite
- nodejs version >= v16.18.0

## Run
| env                    | command                          |
|------------------------|----------------------------------|
| dev                    | npm run dev                      |
| prod                   | npm run build & npm run preview  |
| prod with imps-backend | npm run build:backend            |

## Technical
|              | Tool      |
|--------------|-----------|
| State        | pinia     |
| Time         | dayjs     |
| Chart        | chart.js  |
| HTTP manager | axios     |
| Bundle tools | vite      |


## .env Configuration
This project has many configuration which be setted through `env` command line (`process.env`) and `dotenv` (can set variable in `.env` file).

|Configuration|Required| type   | Default value | Description                  |
|-------------|--------|--------|---------------|------------------------------|
|VITE_BASE_IMPS_API_URL|Yes| string | http://localhost:8080/  | The API Endpoint of IMPS API |

