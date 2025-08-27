const UNICODE_SUBTEXT = [
  "\u2080",
  "\u2081",
  "\u2082",
  "\u2083",
  "\u2084",
  "\u2085",
  "\u2086",
  "\u2087",
  "\u2088",
  "\u2089",
];

export function numberToSubtext(number) {
  let subtext = number.toString().split("");
  subtext = subtext
    .map((char) => {
      return UNICODE_SUBTEXT[parseInt(char)];
    })
    .join("");
  return subtext;
}
