const SECCIONES = [
  {
    h: '1. Quién es el responsable',
    p: 'El responsable del tratamiento de los datos es Facundo Dicroce, titular de Patitas. Podés contactarlo por cualquier tema de privacidad a facundodicroce76@gmail.com.',
  },
  {
    h: '2. Qué datos recopilamos',
    p: 'De la veterinaria (cuenta): email, nombre, WhatsApp y datos del negocio. De las mascotas: nombre, especie, edad, señas particulares y foto. De los dueños: nombre y número de WhatsApp, que los carga su veterinaria al registrar al paciente. La contraseña de tu cuenta se guarda cifrada, nunca en texto plano.',
  },
  {
    h: '3. Para qué usamos tus datos',
    p: 'Para prestar el servicio: gestionar las fichas clínicas, el historial de atenciones, generar el QR de cada paciente y permitir el contacto entre la veterinaria y los dueños. No usamos tus datos para publicidad ni los vendemos.',
  },
  {
    h: '4. Qué es público y qué es privado',
    p: 'La ficha pública que se abre al escanear el QR muestra únicamente los datos de la mascota (nombre, especie, edad, foto) y el contacto de la veterinaria. El nombre y el WhatsApp del dueño, así como la historia clínica, solo los puede ver la veterinaria dueña del paciente cuando inicia sesión.',
  },
  {
    h: '5. Con quién compartimos tus datos',
    p: 'No vendemos ni alquilamos tus datos personales. Solo intervienen los proveedores técnicos necesarios para operar el servicio (alojamiento de la app y base de datos), o si una autoridad competente lo exige por ley.',
  },
  {
    h: '6. Seguridad',
    p: 'Los datos viajan por conexiones cifradas y el acceso está restringido por roles: la lectura anónima solo alcanza los datos públicos de la ficha. Hacemos un esfuerzo razonable para protegerlos, aunque ningún sistema es completamente infalible.',
  },
  {
    h: '7. Cuánto tiempo los guardamos',
    p: 'Guardamos tus datos mientras mantengas tu cuenta activa. Si la das de baja, podés pedir la eliminación de tus datos escribiendo al contacto de esta política.',
  },
  {
    h: '8. Tus derechos (Ley 25.326)',
    p: 'Tenés derecho a acceder, rectificar, actualizar y suprimir tus datos personales, conforme a la Ley 25.326 de Protección de Datos Personales. Para ejercerlos, escribí a facundodicroce76@gmail.com indicando tu pedido. El responsable tramita la inscripción de la base de datos ante el Registro Nacional de Bases de Datos de la AAIP.',
  },
  {
    h: '9. Cambios en esta política',
    p: 'Si modificamos esta política, publicaremos la versión actualizada en esta página.',
  },
]

/** Página de Política de Privacidad de Patitas. */
export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold text-stone-900">Política de Privacidad</h1>
          <p className="mt-2 text-xs text-stone-500">Última actualización: 16 de octubre de 2026</p>
          <div className="mt-6 space-y-6">
            {SECCIONES.map((s) => (
              <div key={s.h}>
                <h2 className="text-base font-extrabold text-stone-900">{s.h}</h2>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
