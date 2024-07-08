
# CliMB
Upravljalec plezalnih centrov/dvoran ter zaposlenih in obiskovalcev (clani)


## Potek Dela
1. Narediva diagrame in prototip
	- use case
	- komponentni (prikaz povezave storitev v okolju)
	- figma design prototipa
2. Vzpostavitev zacetnega razvojnega okolja
	- V docker povezani service-i -> Angular, Flask, Keycloak, Baza (se nevem kera)
3. Razvoj programske opreme
4. Testiranje
5. Vzpostavitev


### Podatkovna Baza

#### E-R Diagram
**TODO**
#### Entities:
##### Uporabnik/Clan
- Ime/priimek
- Telefonska st.
- E-mail
- *Slika?*
- *Varnostna Izjava?*
- Status - (enum)
	- Student
	- Odrasli
	- Otrok
	- Clan kluba?
	- Upokojenec
- `<List> Obisk`
- `<List> Vstopnica`

##### Trener
*?je lahko tudi uporabnik verjetno*

##### Zaposlen
*?je lahko tudi uporabnik verjetno*

##### Obisk
**Je obisk basically vstopnica?**

##### Vstopnica
- Veljavna (boolean)
- Datum/DateTime nakupa/veljavna od
- Veljavna do
##### Admin?


### Funkcionalnosti

#### Upravljalnje obiskovalcev/clanov


#### Upravljanje obiskov
##### Omogoceno placilo preko paypala !!!


#### Upravljanje posebnih terminov
(vodene vadbe, zasedenost dvoran, rojstno dnevne zabave?, druge aktivnosti...)


#### Obracunavanje stroskov
**Opravljeno delo trenerjev in zaposlenih**
*?Mogoce v smislu tudi  stroski najema dvorane, stroski vzdrzevanja...* 

#### Identity and Access management
##### Keycloak

**Features:**
- SSO/Social Login
- Enables multi-tenancy (realms)
- Stores login credentials
- (Custom) Theme
- OAuth 2.0 (industry-standard protocol for authorization)



