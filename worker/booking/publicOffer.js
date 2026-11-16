// Verified against https://tanmaypractice.com/spoluprace/ on 2026-11-16.
// Import only on an explicit coach request; never replace an existing price.
export const REGULAR_PACKAGE_ID = 'web-regular-four';
export const PUBLIC_SERVICES = [
  {id:'web-individual',name_cs:'Individuální trénink',name_en:'Individual training',duration_min:60,price_minor:100000,capacity:1,min_participants:1},
  {id:'web-pair',name_cs:'Trénink ve dvojici',name_en:'Training for two',duration_min:60,price_minor:60000,capacity:2,min_participants:2},
  {id:'web-small-group',name_cs:'Trénink v malé skupině',name_en:'Small group training',duration_min:75,price_minor:50000,capacity:6,min_participants:3},
];
export async function seedPublicOffer(db,now=Date.now()) {
  const statements=[];
  for (const service of PUBLIC_SERVICES) {
    const keys=Object.keys(service);
    statements.push(db.prepare(`INSERT INTO booking_services (${keys.join(',')},credit_cost_units,currency,slot_interval_min,confirmation_mode,description_cs,description_en,sort_order,created_at,updated_at)
      VALUES (${keys.map(()=>'?').join(',')},1,'CZK',15,'REQUEST',?,?,?, ?,?) ON CONFLICT(id) DO NOTHING`).bind(...keys.map(k=>service[k]),
      service.capacity>1?'Cena za osobu. Termín potvrzuje trenér.':'Jednorázový trénink. Pravidelná spolupráce: předplacený balíček alespoň čtyř tréninků na měsíc.',
      service.capacity>1?'Price per person. The coach confirms the session.':'Single session. Regular training uses a prepaid package of at least four sessions per month.',90+PUBLIC_SERVICES.indexOf(service),now,now));
  }
  // Initialize places once. This also repairs the initial offer import which
  // created services without links, while preserving any coach configuration
  // (including an intentional empty selection after the first initialization).
  for (const service of PUBLIC_SERVICES) {
    const marker='public-offer-locations-v1:'+service.id;
    statements.push(db.prepare(`INSERT INTO booking_service_locations(service_id,location_id)
      SELECT ?,l.id FROM booking_locations l WHERE l.active=1 AND l.type IN ('STUDIO','OUTDOORS')
      AND NOT EXISTS(SELECT 1 FROM booking_service_locations WHERE service_id=?)
      AND NOT EXISTS(SELECT 1 FROM booking_data_migrations WHERE name=?)
      ON CONFLICT DO NOTHING`).bind(service.id,service.id,marker));
    statements.push(db.prepare("INSERT INTO booking_data_migrations(name,applied_at,summary) VALUES(?,?,'{}') ON CONFLICT DO NOTHING").bind(marker,now));
  }
  statements.push(db.prepare(`INSERT INTO package_definitions (id,name_cs,name_en,description_cs,description_en,credit_units,valid_days,price_minor,currency,active,sort_order,created_at,updated_at)
    VALUES (?,'Pravidelný trénink · 4 setkání','Regular training · 4 sessions',
      'Předplaceno. Kalendářní měsíc od prvního tréninku; datum začátku se zadává při připsání balíčku.',
      'Prepaid. One calendar month from the first session; choose its date when granting the package.',4,NULL,320000,'CZK',1,90,?,?) ON CONFLICT(id) DO NOTHING`).bind(REGULAR_PACKAGE_ID,now,now));
  statements.push(db.prepare('INSERT INTO package_definition_services(package_definition_id,service_id) VALUES (?,?) ON CONFLICT DO NOTHING').bind(REGULAR_PACKAGE_ID,'web-individual'));
  await db.batch(statements);
  return {services:PUBLIC_SERVICES.map(s=>s.id),packageDefinitionId:REGULAR_PACKAGE_ID,source:'https://tanmaypractice.com/spoluprace/'};
}
