import {AstroTime,AU_PER_LY,Body,C_AUDAY,Ecliptic,GeoMoonState,HelioState,MakeTime,RotateState,RotateVector,Rotation_ECT_EQJ,Rotation_EQJ_ECT,Vector,e_tilt} from "astronomy-engine";

// Independent sidereal/node calculations on Astronomy Engine 2.1.19 (MIT).
// Supported product dates: 1900–2100. These are not Swiss Ephemeris algorithms.
// A 2,412-point monthly comparison with Swiss 2.10.03/Moshier found maximum
// differences: Lahiri 0.421 arcsec, True Chitra 0.351 arcsec, mean node
// 0.420 arcsec, osculating node 0.847 arcmin. These sampled differences are
// regression evidence, not independent accuracy guarantees or exact parity.
//
// Definitions of Lahiri (1956-03-21, 00 TT: 23°15′00.658″), True Chitra
// (Spica at 180°), and the osculating node:
// https://www.astro.com/swisseph/swisseph.htm sections 2.8.5, 2.2.2, Appendix E.
// Only mathematical definitions and numerical comparison outputs are used;
// no Swiss implementation or runtime data is included.

const normalize=angle=>(angle%360+360)%360;
const RAD=Math.PI/180;
const lahiriEpoch=AstroTime.FromTerrestrialTime(2435553.5-2451545);
const lahiriAxis=RotateVector(Rotation_ECT_EQJ(lahiriEpoch),new Vector(1,0,0,lahiriEpoch));
const lahiriInitial=23+15/60+0.658/3600;

// SIMBAD / Hipparcos (van Leeuwen 2007): ICRS coordinates at J2000,
// proper motions (RA*cos(dec), declination) in mas/year; parallax in mas.
// https://simbad.cds.unistra.fr/simbad/sim-basic?Ident=Spica
const spicaRA=(13+25/60+11.57937/3600)*15*RAD;
const spicaDec=-(11+9/60+40.7501/3600)*RAD;
const spicaDistance=(1000/13.06)*3.26156*AU_PER_LY;

function spicaLongitude(time){
  const years=time.tt/365.25;
  const ra=spicaRA+years*(-42.35)*RAD/(3600000*Math.cos(spicaDec));
  const dec=spicaDec+years*(-30.67)*RAD/3600000;
  const earth=HelioState(Body.Earth,time);
  const x=spicaDistance*Math.cos(dec)*Math.cos(ra)-earth.x;
  const y=spicaDistance*Math.cos(dec)*Math.sin(ra)-earth.y;
  const z=spicaDistance*Math.sin(dec)-earth.z;
  const distance=Math.hypot(x,y,z);
  // First-order annual aberration: add observer velocity/c to the incoming
  // direction. This matches Astronomy Engine's MIT user-star convention,
  // without mutating any global DefineStar slots. Parallax is included above.
  // Radial motion, perspective acceleration, gravitational deflection and the
  // tiny ICRS/EQJ frame bias are omitted; no sub-arcsecond accuracy is promised.
  return Ecliptic(new Vector(x/distance+earth.vx/C_AUDAY,y/distance+earth.vy/C_AUDAY,z/distance+earth.vz/C_AUDAY,time)).elon;
}

export function ayanamsaAt(date,mode="lahiri"){
  const time=MakeTime(date);
  if(mode==="true-chitra")return normalize(spicaLongitude(time)-180);
  // Carry the true equinox direction at the defining epoch into the true
  // ecliptic of the requested date; includes the matching nutation convention.
  const reference=new Vector(lahiriAxis.x,lahiriAxis.y,lahiriAxis.z,time);
  return normalize(lahiriInitial+Ecliptic(reference).elon);
}

export function lunarNodeAt(date,mode="mean"){
  const time=MakeTime(date);
  if(mode==="true"){
    // Rotate the position and inertial velocity with the SAME date matrix.
    // Differentiating a moving ecliptic frame would introduce a false velocity.
    const s=RotateState(Rotation_EQJ_ECT(time),GeoMoonState(time));
    const hx=s.y*s.vz-s.z*s.vy,hy=s.z*s.vx-s.x*s.vz;
    // The ascending intersection is z-axis cross orbital normal: (-hy,hx,0).
    return normalize(Math.atan2(hx,-hy)/RAD);
  }
  // IERS Conventions (2003), Simon et al. (1994), A&A 282, 663–683.
  // Astronomical polynomial coefficients (arcsec), independently evaluated
  // here in JavaScript. Reference implementation: ERFA eraFaom03, derived
  // from IAU SOFA, Copyright (C) 2013–2023 NumFOCUS Foundation (BSD-3-Clause).
  // https://raw.githubusercontent.com/liberfa/erfa/master/src/faom03.c
  // This uses the published numerical model, not copied ERFA/SOFA source.
  const centuries=time.tt/36525;
  const coefficients=[450160.398036,-6962890.5431,7.4722,0.007702,-0.00005939];
  const meanArcsec=coefficients.reduce((sum,value,power)=>sum+value*centuries**power,0);
  return normalize((meanArcsec+e_tilt(time).dpsi)/3600);
}
