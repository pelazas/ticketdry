'use client'
import { useState } from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "No he recibido mi entrada, ¿qué puedo hacer?",
      answer: (
        <p>
          Al comprar una entrada, te la enviamos automáticamente a la dirección de correo que has indicado en el proceso de la compra.
          Si no la encuentras, puedes hacer lo siguiente:
          <br/><br/>
          1. Revisa tu bandeja de SPAM. Algunas veces nuestros correos se marcan como “correo no deseado”.
          <br/>
          2. Comprueba con tu banco que el pago se ha realizado correctamente.
          <br/>
          3. Si todo es correcto y siguen sin aparecer, escríbenos a través de este formulario de contacto y te ayudaremos.
          <br/><br/>
          Cuando finalices la compra, tienes la posibilidad de descargarlas en el momento. Es recomendable hacerlo para tenerlas siempre localizadas.
          <br/><br/>
          Aunque no es habitual, es posible que las entradas no lleguen hasta 48 horas laborales.
        </p>
      )
    },
    {
      question: "La página web me solicita un código para completar la compra, pero no lo he recibido",
      answer: (
        <p>
          Algunos bancos envían un código por SMS para completar la compra. Esa solicitud de código de seguridad la envía tu banco, no nuestra página web.
          <br/><br/>
          Para solucionar cualquier problema, deberás ponerte en contacto con tu entidad bancaria.
        </p>
      )
    },
    {
      question: "Si no puedo asistir al evento, ¿me devolvéis el importe abonado?",
      answer: (
        <p>
          La no asistencia al evento no es motivo de devolución del importe de la entrada, como se refleja en las condiciones y términos del servicio ofertado.
        </p>
      )
    },
    {
      question: "¿Dónde recibo mis entradas?",
      answer: (
        <p>
          Tras recibir el pago correctamente, las entradas se envían al correo con el que realizaste la compra. 
          <br/><br/>
          Este proceso puede tardar hasta un máximo de 48 horas.
        </p>
      )
    },
    {
      question: "¿Qué necesito para acceder al evento? ¿Es necesario que imprima las entradas?",
      answer: (
        <p>
          No es necesario que imprimas tu entrada, aunque puede ser recomendable. Para acceder al recinto, solo necesitas el código QR, que puedes mostrar en tu móvil o en papel.
          <br/><br/>
          Te recomendamos imprimir las entradas por si tu dispositivo se queda sin batería o surge otro inconveniente.
        </p>
      )
    },
    {
      question: "Mi evento se ha cancelado, ¿qué tengo que hacer ahora?",
      answer: (
        <p>
          Si tu evento se ha cancelado, te enviaremos un correo informándote. Como norma general, recibirás el reembolso en un plazo máximo de 60 días, descontados los gastos de gestión.
          <br/><br/>
          El abono se realizará a través del mismo método de pago utilizado para la compra.
        </p>
      )
    },
    {
      question: "En caso de devolución por cancelación del evento, ¿se reembolsarán los gastos de gestión?",
      answer: (
        <p>
          La devolución del importe de las entradas no incluye los gastos de gestión, ya que este es un servicio ya prestado.
        </p>
      )
    },
    {
      question: "Organizo un evento y quiero vender mis entradas con vosotros, ¿cómo lo hago?",
      answer: (
        <p>
          Si estás organizando un evento y quieres vender entradas con nosotros, contáctanos a través de info@ticketdry.com. Estaremos encantados de ayudarte.
        </p>
      )
    },
    {
      question: "Si no has encontrado respuestas a tus preguntas, contacta con nosotros en info@ticketdry.com",
      answer: (
        <p>
          Puedes contactarnos en cualquier momento a través de info@ticketdry.com.
        </p>
      )
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4 border-b border-gray-200">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full text-left text-lg font-medium text-gray-900 py-4 flex justify-between items-center focus:outline-none"
          >
            {faq.question}
            <span>{activeIndex === index ? '-' : '+'}</span>
          </button>
          <div
            className={`mt-2 text-gray-700 transition-all duration-300 overflow-hidden ${
              activeIndex === index ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
