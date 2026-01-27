
export default function Section() {
    return (
        <section className="bg-slate-50 min-h-screen flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">
                    Accesibilidad y Claridad
                </h1>
                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                    Esta aplicación utiliza <strong>Atkinson Hyperlegible</strong>, una tipografía diseñada específicamente por el Braille Institute para maximizar la legibilidad y ayudar a personas con baja visión.
                </p>
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Es una fuente agradable para el usuario promedio porque mantiene un equilibrio perfecto entre estética moderna y funcionalidad extrema.
                    </p>
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <p className="font-mono text-sm text-slate-500 mb-2">Muestra de caracteres legibles:</p>
                        <p className="text-2xl tracking-wide">Il1 O0 8B 5S 2Z</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
