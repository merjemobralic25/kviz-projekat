export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateLogin = (values) => {
  const errors = {};
  if (!values.email.trim()) errors.email = 'Email je obavezan.';
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Unesite validan email.';
  if (!values.password) errors.password = 'Lozinka je obavezna.';
  return errors;
};

export const validateRegister = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Ime je obavezno.';
  else if (values.name.trim().length < 2) errors.name = 'Ime mora imati najmanje 2 karaktera.';

  if (!values.email.trim()) errors.email = 'Email je obavezan.';
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Unesite validan email.';

  if (!values.password) errors.password = 'Lozinka je obavezna.';
  else if (values.password.length < 6) errors.password = 'Lozinka mora imati najmanje 6 karaktera.';
  else if (!/[A-Z]/.test(values.password) && !/[0-9]/.test(values.password)) {
    errors.password = 'Lozinka mora sadržavati broj ili veliko slovo.';
  }

  if (!values.confirmPassword) errors.confirmPassword = 'Potvrda lozinke je obavezna.';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Lozinke se ne poklapaju.';

  return errors;
};

export const validateContact = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Ime je obavezno.';
  if (!values.email.trim()) errors.email = 'Email je obavezan.';
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Unesite validan email.';
  if (!values.subject.trim()) errors.subject = 'Predmet je obavezan.';
  if (!values.message.trim()) errors.message = 'Poruka je obavezna.';
  else if (values.message.trim().length < 10) errors.message = 'Poruka mora imati najmanje 10 karaktera.';
  return errors;
};

export const validateQuiz = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Naziv kviza je obavezan.';
  if (!values.description.trim()) errors.description = 'Opis je obavezan.';
  if (!values.category.trim()) errors.category = 'Kategorija je obavezna.';
  if (!values.difficulty) errors.difficulty = 'Odaberite težinu.';
  if (!values.timeLimit || Number(values.timeLimit) < 30) errors.timeLimit = 'Minimalno 30 sekundi.';
  return errors;
};