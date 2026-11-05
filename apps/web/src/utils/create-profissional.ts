type ProfessionalData = {
  profession: string,
  abilities: string,
}

export function createProfessionalText({
  profession,
  abilities
}: ProfessionalData){
  return `Profissão: ${profession}. Serviços oferecidos: ${abilities}`
}
