// Hybrid solar eclipse dates in the product's inclusive 1900–2100 range.
// Factual Gregorian calendar dates from NASA / Fred Espenak, Five Millennium
// Catalog of Solar Eclipses; records whose Eclipse Type begins with H.
// Catalogue checked 2026-10-01. This table supplies global eclipse type only;
// Astronomy Engine still computes event times and visibility independently.
//
// 1900: no hybrid (May 28 = T, November 22 = A):
// https://eclipse.gsfc.nasa.gov/SEcat5/SE1801-1900.html
// 1901–2000: all 6 hybrids, matching NASA's century statistics:
// https://eclipse.gsfc.nasa.gov/SEcat5/SE1901-2000.html
// 2001–2100: all 7 hybrids, matching NASA's century statistics:
// https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html
// H3 on 2013-11-03 is included: it is a hybrid subtype, not a total eclipse.
// Each listed catalogue date is also the UT date of greatest eclipse.
export const HYBRID_ECLIPSE_DATES=[
  "1908-12-23", // NASA catalogue 09301
  "1909-06-17", // 09302
  "1912-04-17", // 09308
  "1930-04-28", // 09351
  "1986-10-03", // 09479
  "1987-03-29", // 09480
  "2005-04-08", // 09519
  "2013-11-03", // 09538, H3
  "2023-04-20", // 09559
  "2031-11-14", // 09578
  "2049-11-25", // 09618
  "2050-05-20", // 09619
  "2067-12-06", // 09659
];
