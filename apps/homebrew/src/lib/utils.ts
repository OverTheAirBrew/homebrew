export async function nullIfEmpty(value: any) {
  if (value === '') {
    return null;
  }

  return value;
}
