'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Cpu,
  ChevronLeft,
  BookOpen,
  Terminal,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HardDrive,
  Play,
  RefreshCw,
  Info,
  Layers,
  Activity,
  FileText,
  Keyboard,
  Check,
  HelpCircle,
} from 'lucide-react'
import { MarkdownContent } from '@/components/markdown-content'

type OpType = 'READ_KEYBOARD' | 'SAVE_FILE' | 'ALLOCATE_RAM' | 'CREATE_PROCESS'

interface SimStep {
  title: string
  layer: 'user' | 'kernel' | 'hardware' | 'return'
  desc: string
}

const simulatorOperations: Record<OpType, {
  name: string
  actionLabel: string
  icon: React.ReactNode
  description: string
  steps: SimStep[]
}> = {
  READ_KEYBOARD: {
    name: 'Leer Teclado',
    actionLabel: 'read(fd, buffer, size)',
    icon: <Keyboard className="size-4" />,
    description: 'Obtiene los caracteres ingresados por el usuario mediante una llamada al sistema de lectura.',
    steps: [
      {
        title: 'Llamada del Usuario (User Space)',
        layer: 'user',
        desc: 'La aplicación (ej. una terminal) invoca la función read() de la biblioteca del sistema pasando el descriptor de archivo de la entrada estándar.',
      },
      {
        title: 'Trampa al Núcleo (Mode Switch)',
        layer: 'kernel',
        desc: 'Se ejecuta una instrucción de trampa (trap/interrupt). El hardware cambia del Modo Usuario al Modo Kernel (privilegiado) y transfiere el control al manejador de llamadas al sistema del SO.',
      },
      {
        title: 'Lectura del Hardware',
        layer: 'hardware',
        desc: 'El driver del teclado en el kernel interactúa con el chip controlador del teclado en la placa base para extraer los códigos de escaneo (keycodes) guardados en su búfer físico.',
      },
      {
        title: 'Retorno y Datos (Return to User)',
        layer: 'user',
        desc: 'El Kernel copia los datos leídos del búfer de memoria del núcleo al búfer de la aplicación en el espacio de usuario, cambia el modo de vuelta a Modo Usuario, y devuelve el control al programa.',
      },
    ],
  },
  SAVE_FILE: {
    name: 'Guardar Archivo',
    actionLabel: 'write(fd, buffer, size)',
    icon: <FileText className="size-4" />,
    description: 'Escribe datos desde la memoria de la aplicación hacia el sistema de archivos físico en el disco.',
    steps: [
      {
        title: 'Petición de Escritura',
        layer: 'user',
        desc: 'Un editor de texto llama a write() para guardar los cambios de un documento, proporcionando la dirección de memoria de los caracteres a guardar.',
      },
      {
        title: 'Procesamiento de Archivos (Kernel)',
        layer: 'kernel',
        desc: 'El núcleo verifica los permisos de escritura del proceso y mapea la ruta lógica del archivo a bloques de disco usando el sistema de archivos del sistema operativo (ej. ext4, NTFS).',
      },
      {
        title: 'Escritura Física (Hardware)',
        layer: 'hardware',
        desc: 'El kernel instruye al controlador de almacenamiento (SSD/SATA/NVMe) a través de DMA para transferir y escribir los datos en las celdas físicas de almacenamiento.',
      },
      {
        title: 'Confirmación al Proceso',
        layer: 'user',
        desc: 'Una vez completada la escritura (o almacenada en la caché de disco), el kernel actualiza el contador de bytes del archivo, devuelve el control a la aplicación y el programa continúa.',
      },
    ],
  },
  ALLOCATE_RAM: {
    name: 'Reservar RAM',
    actionLabel: 'brk() / mmap()',
    icon: <Cpu className="size-4" />,
    description: 'Solicita al sistema operativo que asigne bloques de memoria física adicionales al espacio de direcciones del proceso.',
    steps: [
      {
        title: 'Solicitud de Memoria',
        layer: 'user',
        desc: 'Un programa intenta crear un objeto grande y la biblioteca de lenguaje (ej. malloc en C) detecta que necesita más memoria física del heap, invocando brk() o mmap().',
      },
      {
        title: 'Gestor de Memoria Virtual',
        layer: 'kernel',
        desc: 'El administrador de memoria virtual del kernel recibe la solicitud, localiza páginas de memoria libres en la RAM física, y actualiza la Tabla de Páginas (Page Table) del proceso.',
      },
      {
        title: 'Hardware MMU (Asignación)',
        layer: 'hardware',
        desc: 'La Unidad de Gestión de Memoria (MMU) del procesador se sincroniza para que las direcciones virtuales del programa apunten a los marcos físicos reales de la RAM.',
      },
      {
        title: 'Puntero Devuelto',
        layer: 'user',
        desc: 'El sistema operativo completa la llamada del sistema devolviendo la nueva dirección base de memoria. La aplicación ya puede escribir en ese espacio sin provocar un fallo de segmentación.',
      },
    ],
  },
  CREATE_PROCESS: {
    name: 'Crear Proceso',
    actionLabel: 'fork() / execve()',
    icon: <Activity className="size-4" />,
    description: 'Duplica el proceso actual para iniciar una nueva tarea en un espacio de direcciones aislado.',
    steps: [
      {
        title: 'Duplicación de Tarea',
        layer: 'user',
        desc: 'Un navegador web invoca fork() para iniciar una nueva pestaña en un proceso independiente para aislar fallos y mejorar la seguridad.',
      },
      {
        title: 'Clonación de Estructuras',
        layer: 'kernel',
        desc: 'El Kernel duplica el Bloque de Control de Proceso (PCB) de la tarea padre, asigna un nuevo PID (Process ID), clona la tabla de descriptores y copia la tabla de páginas mediante Copy-On-Write.',
      },
      {
        title: 'Planificador de CPU',
        layer: 'hardware',
        desc: 'El planificador (scheduler) del kernel añade el nuevo proceso a la cola de listos (ready queue). La CPU física comienza a ejecutar ciclos de reloj para la nueva tarea.',
      },
      {
        title: 'Ejecución Paralela',
        layer: 'user',
        desc: 'La llamada al sistema devuelve el control. El proceso original (padre) recibe el PID del hijo, y el nuevo proceso (hijo) recibe el valor 0, dividiendo sus caminos de ejecución.',
      },
    ],
  },
}

interface Question {
  id: number
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: '¿Cuál de los siguientes es el objetivo principal del sistema operativo que busca hacer la computadora más amigable y fácil de programar?',
    options: [
      'Eficiencia de recursos',
      'Conveniencia / Usabilidad',
      'Capacidad de evolución',
      'Portabilidad de compilación',
    ],
    answerIndex: 1,
    explanation: 'El objetivo de Conveniencia busca abstraer la extrema complejidad del hardware físico, presentando a los desarrolladores y usuarios una interfaz y un conjunto de llamadas del sistema (API) mucho más sencillos.',
  },
  {
    id: 2,
    question: 'Desde la perspectiva del sistema operativo como "Administrador de Recursos", ¿cuál es su tarea primordial?',
    options: [
      'Proporcionar un compilador optimizado para lenguajes de alto nivel',
      'Traducir páginas web a código binario ejecutable',
      'Asignar CPU, memoria RAM y dispositivos a los procesos de forma equitativa y eficiente',
      'Eliminar virus y malware del disco duro automáticamente',
    ],
    answerIndex: 2,
    explanation: 'Como administrador de recursos, el SO actúa como un árbitro que controla cómo los procesos en competencia acceden a los recursos de hardware limitados del sistema (procesador, memoria física, almacenamiento y E/S).',
  },
  {
    id: 3,
    question: '¿Qué mecanismo del hardware permite al procesador cambiar de Modo Usuario a Modo Kernel para ejecutar una función del sistema operativo?',
    options: [
      'Un reinicio de la fuente de alimentación',
      'Una interrupción o trampa de software (Syscall / Trap)',
      'Un incremento en la frecuencia de reloj del bus del sistema',
      'La lectura directa de un sector en el disco SSD',
    ],
    answerIndex: 1,
    explanation: 'Una llamada al sistema (syscall) genera una trampa de software (trap), que es una interrupción síncrona controlada por hardware. Esto hace que el procesador cambie el bit de modo a Kernel Mode y salte a una posición predefinida del código del SO.',
  },
  {
    id: 4,
    question: '¿Por qué el objetivo de "Capacidad de Evolución" es crítico en el diseño moderno de sistemas operativos?',
    options: [
      'Permite actualizar controladores de hardware, corregir fallos de seguridad y añadir nuevas funciones sin rediseñar todo el núcleo',
      'Garantiza que la velocidad de procesamiento aumente exponencialmente cada año',
      'Evita que el usuario tenga que pagar licencias comerciales de software',
      'Asegura que el sistema consuma menos memoria RAM en dispositivos antiguos',
    ],
    answerIndex: 0,
    explanation: 'Los sistemas operativos son enormes y longevos. Su diseño debe ser modular (o estructurado de forma que las capas estén desacopladas) para permitir introducir parches de seguridad, mejoras de rendimiento y soporte de nuevo hardware de forma incremental.',
  },
  {
    id: 5,
    question: 'En la arquitectura de capas de una computadora, ¿dónde se sitúa el Sistema Operativo?',
    options: [
      'Por encima de las aplicaciones de usuario, controlando el navegador de internet',
      'Directamente integrado dentro de los circuitos físicos de la memoria RAM',
      'Como un intermediario entre las aplicaciones del usuario y el hardware físico de la máquina',
      'Exclusivamente en los servidores de la nube y bases de datos remotas',
    ],
    answerIndex: 2,
    explanation: 'El sistema operativo se ubica justo por encima del hardware real (bare metal) y por debajo de las aplicaciones de usuario. Su función es mediar todas las solicitudes de software dirigidas a usar componentes físicos del ordenador.',
  },
]

type TabId = 'teoria' | 'simulador' | 'evaluacion'

interface Unidad1ViewProps {
  teoriaContent: string
}

export function Unidad1View({ teoriaContent }: Unidad1ViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('teoria')
  const [activeOp, setActiveOp] = useState<OpType>('SAVE_FILE')
  const [simStep, setSimStep] = useState<number>(-1)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState<boolean>(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isSimulating && simStep < 3) {
      timer = setTimeout(() => {
        setSimStep((prev) => prev + 1)
      }, 3000)
    } else if (simStep === 3) {
      setIsSimulating(false)
    }
    return () => clearTimeout(timer)
  }, [isSimulating, simStep])

  const startSimulation = () => {
    setSimStep(0)
    setIsSimulating(true)
  }

  const handleSelectOp = (op: OpType) => {
    setActiveOp(op)
    setSimStep(-1)
    setIsSimulating(false)
  }

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < quizQuestions.length) {
      alert('Por favor, responde todas las preguntas antes de finalizar.')
      return
    }
    setShowResults(true)
  }

  const handleResetQuiz = () => {
    setAnswers({})
    setShowResults(false)
  }

  const score = quizQuestions.reduce((acc, q) => {
    return answers[q.id] === q.answerIndex ? acc + 1 : acc
  }, 0)

  return (
    <div className="min-h-screen bg-background pb-16 relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/4 size-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.72 0.18 196 / 8%) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="size-4" />
            Volver al inicio
          </Link>
        </div>

        <div className="mb-10 rounded-xl border border-border/50 bg-surface-2 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
                <Cpu className="size-3.5 text-primary" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Unidad 01
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Conceptualización de un Sistema Operativo
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Estudio del software base que controla la máquina: ¿Qué funciones y objetivos cumple el kernel? ¿Cómo realiza la intermediación entre el código de las aplicaciones y los chips físicos del computador?
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-surface border border-border/40 p-4 shrink-0">
              <Layers className="size-8 text-primary" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase">Materia</p>
                <p className="text-sm font-semibold text-foreground">Sistemas Operativos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 border-b border-border/60">
          <div className="flex gap-2">
            {[
              { id: 'teoria' as const, label: '1. Contenido Teórico', icon: <BookOpen className="size-4" /> },
              { id: 'simulador' as const, label: '2. Simulador de Kernel', icon: <Terminal className="size-4" /> },
              { id: 'evaluacion' as const, label: '3. Autoevaluación', icon: <HelpCircle className="size-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-xs font-medium transition-all relative border-b-2 -mb-[2px] ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'teoria' && (
          <div className="space-y-8 animate-slide-in-up">
            <MarkdownContent content={teoriaContent} />

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">¿Listo para ver al Kernel en acción?</h3>
                <p className="text-xs text-muted-foreground">Interactúa con nuestro simulador visual para comprender cómo las aplicaciones activan llamadas al sistema hacia el hardware.</p>
              </div>
              <button
                onClick={() => setActiveTab('simulador')}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Ir al Simulador
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'simulador' && (
          <div className="space-y-6 animate-slide-in-up">
            <div className="rounded-xl border border-border/50 bg-surface-2 p-6">
              <h2 className="mb-2 text-lg font-bold text-foreground flex items-center gap-2">
                <Terminal className="size-4 text-primary" />
                Simulador de Llamadas al Sistema (System Calls)
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                El mecanismo principal de intermediación del Sistema Operativo se ejecuta a través de llamadas al sistema. Selecciona un comando de usuario a continuación y observa la secuencia animada de flujo de datos y el cambio de privilegios de hardware.
              </p>

              <div className="grid gap-6 lg:grid-cols-4">
                <div className="space-y-2 lg:col-span-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
                    Selecciona Operación
                  </p>
                  {(Object.keys(simulatorOperations) as OpType[]).map((opKey) => {
                    const op = simulatorOperations[opKey]
                    const isSelected = activeOp === opKey
                    return (
                      <button
                        key={opKey}
                        onClick={() => handleSelectOp(opKey)}
                        className={`w-full flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_oklch(0.72_0.18_196_/_10%)]'
                            : 'border-border/60 bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {op.icon}
                          <span className="text-xs font-semibold">{op.name}</span>
                        </div>
                        <span className="font-mono text-[10px] opacity-75 border border-current/25 px-1.5 py-0.5 rounded bg-surface-2">
                          {op.actionLabel}
                        </span>
                      </button>
                    )
                  })}

                  <div className="pt-4">
                    <button
                      onClick={startSimulation}
                      disabled={isSimulating}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-mono text-xs font-semibold text-primary-foreground hover:bg-primary/95 disabled:opacity-40 transition-colors shadow-lg cursor-pointer"
                    >
                      <Play className="size-3.5 fill-current" />
                      {isSimulating ? 'Simulando...' : 'Iniciar Simulación'}
                    </button>
                    <p className="text-[10px] text-muted-foreground text-center mt-2 italic">
                      Las fases avanzan automáticamente cada 3 segundos.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-3 rounded-xl border border-border/60 bg-surface p-6 flex flex-col justify-between min-h-[400px]">
                  <div className="relative flex flex-col gap-4">
                    <div className={`rounded-lg border p-4 transition-all relative ${
                      simStep === 0 || simStep === 3
                        ? 'border-primary bg-primary/5 shadow-[0_0_15px_oklch(0.72_0.18_196_/_10%)]'
                        : 'border-border bg-surface-2/40 opacity-50'
                    }`}>
                      <div className="absolute right-3 top-2 rounded bg-surface px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground uppercase">
                        Espacio de Usuario
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className={`size-2.5 rounded-full ${simStep === 0 || simStep === 3 ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                        <span className="font-mono text-xs font-bold text-foreground">1. Aplicación de Usuario</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Ejecución regular del programa de usuario (Modo No Privilegiado). Mapeado a la API.
                      </p>
                    </div>

                    <div className="flex justify-center h-4 items-center">
                      <div className={`w-0.5 h-full ${simStep === 1 ? 'bg-cyber animate-pulse' : 'bg-border'}`} />
                    </div>

                    <div className={`rounded-lg border p-4 transition-all relative ${
                      simStep === 1
                        ? 'border-cyber bg-cyber-dim shadow-[0_0_15px_oklch(0.65_0.18_155_/_10%)]'
                        : 'border-border bg-surface-2/40 opacity-50'
                    }`}>
                      <div className="absolute right-3 top-2 rounded bg-surface px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground uppercase">
                        Espacio del Núcleo (Kernel Mode)
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className={`size-2.5 rounded-full ${simStep === 1 ? 'bg-cyber animate-pulse' : 'bg-muted-foreground'}`} />
                        <span className="font-mono text-xs font-bold text-foreground">2. Sistema Operativo (Nucleo)</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Código del kernel con control absoluto de la CPU y hardware físico (Modo Privilegiado 0).
                      </p>
                    </div>

                    <div className="flex justify-center h-4 items-center">
                      <div className={`w-0.5 h-full ${simStep === 2 ? 'bg-amber-400 animate-pulse' : 'bg-border'}`} />
                    </div>

                    <div className={`rounded-lg border p-4 transition-all relative ${
                      simStep === 2
                        ? 'border-amber-400/50 bg-amber-400/5 shadow-[0_0_15px_oklch(0.70_0.18_60_/_10%)]'
                        : 'border-border bg-surface-2/40 opacity-50'
                    }`}>
                      <div className="absolute right-3 top-2 rounded bg-surface px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground uppercase">
                        Hardware
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className={`size-2.5 rounded-full ${simStep === 2 ? 'bg-amber-400 animate-pulse' : 'bg-muted-foreground'}`} />
                        <span className="font-mono text-xs font-bold text-foreground flex items-center gap-1">
                          <HardDrive className="size-3" />
                          3. Controladores y Chips Físicos
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Memoria RAM, registros del procesador, controladores de disco, interfaces físicas.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-border/80 bg-surface-2 p-4">
                    {simStep === -1 ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Info className="size-4 text-primary shrink-0" />
                        <p className="text-xs">
                          Selecciona una llamada del sistema en el panel izquierdo y haz clic en <strong>Iniciar Simulación</strong> para observar paso a paso la intermediación de recursos.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] text-primary uppercase font-bold">
                            Paso {simStep + 1} de 4
                          </span>
                          <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary">
                            {simStep === 0 ? 'USER MODE' : simStep === 3 ? 'USER MODE' : 'KERNEL MODE'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-foreground mb-1">
                          {simulatorOperations[activeOp].steps[simStep].title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {simulatorOperations[activeOp].steps[simStep].desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluacion' && (
          <div className="space-y-6 animate-slide-in-up">
            <div className="rounded-xl border border-border/50 bg-surface-2 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/40 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    Autoevaluación de Conceptos Básicos
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Comprueba tus conocimientos sobre la definición y los objetivos del sistema operativo.
                  </p>
                </div>
                {showResults && (
                  <div className="rounded-lg bg-surface border border-border/80 px-4 py-2 text-center shrink-0">
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Resultado</p>
                    <p className="text-sm font-bold text-foreground">
                      <span className={score >= 3 ? 'text-cyber' : 'text-alert'}>{score}</span> / {quizQuestions.length} Correctas
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {quizQuestions.map((q, qIndex) => {
                  const selectedIndex = answers[q.id]
                  const isCorrect = selectedIndex === q.answerIndex
                  return (
                    <div
                      key={q.id}
                      className={`rounded-lg border p-5 transition-all ${
                        showResults
                          ? isCorrect
                            ? 'border-cyber/30 bg-cyber-dim'
                            : 'border-alert/30 bg-alert/5'
                          : 'border-border/60 bg-surface'
                      }`}
                    >
                      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-start gap-2">
                        <span className="font-mono text-primary text-[11px] mt-0.5">Q{qIndex + 1}.</span>
                        <span>{q.question}</span>
                      </h3>

                      <div className="grid gap-2.5">
                        {q.options.map((option, optIndex) => {
                          const isSelected = selectedIndex === optIndex
                          const isOptionCorrect = q.answerIndex === optIndex

                          let btnStyle = 'border-border/60 bg-surface-2 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                          if (isSelected) {
                            btnStyle = 'border-primary bg-primary/5 text-foreground'
                          }
                          if (showResults) {
                            if (isOptionCorrect) {
                              btnStyle = 'border-cyber bg-cyber-dim text-cyber font-semibold'
                            } else if (isSelected) {
                              btnStyle = 'border-alert bg-alert/5 text-alert'
                            } else {
                              btnStyle = 'border-border/30 bg-surface-2/30 text-muted-foreground/60 opacity-60'
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              disabled={showResults}
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              className={`flex items-center justify-between rounded-md border p-3 text-left text-xs transition-all ${btnStyle} ${
                                !showResults ? 'cursor-pointer' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`size-4 rounded-full border flex items-center justify-center shrink-0 text-[9px] ${
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border/80'
                                }`}>
                                  {isSelected && <Check className="size-2.5 stroke-[3px]" />}
                                </div>
                                <span>{option}</span>
                              </div>

                              {showResults && isOptionCorrect && (
                                <CheckCircle2 className="size-4 text-cyber shrink-0" />
                              )}
                              {showResults && isSelected && !isOptionCorrect && (
                                <XCircle className="size-4 text-alert shrink-0" />
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {showResults && (
                        <div className="mt-4 border-t border-border/40 pt-3 flex items-start gap-2 text-xs">
                          <Info className={`size-4 shrink-0 mt-0.5 ${isCorrect ? 'text-cyber' : 'text-alert'}`} />
                          <div className="text-muted-foreground">
                            <span className="font-semibold text-foreground">Retroalimentación: </span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-border/40 pt-4">
                {!showResults ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="rounded-lg bg-primary px-6 py-2.5 font-mono text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
                  >
                    Calificar Cuestionario
                  </button>
                ) : (
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-6 py-2.5 font-mono text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" />
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
