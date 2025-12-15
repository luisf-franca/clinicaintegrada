import React, { useState } from 'react';
import CreatePaciente from '../../functions/Pacientes/CreatePaciente';

const CriarPacienteAgendamento = ({ onPacienteCriado, onCancelar, especialidadeId }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        telefone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTelefoneChange = (e) => {
        const { name, value } = e.target;

        if (name === 'telefone') {
            const digits = value.replace(/\D/g, '').slice(0, 11);

            let formatted = '';

            if (digits.length > 0) {
                formatted = '(' + digits.substring(0, 2);
            }
            if (digits.length >= 3) {
                formatted += ') ' + digits.substring(2, 7);
            }
            if (digits.length >= 8) {
                formatted += '-' + digits.substring(7, 11);
            }

            setFormData({ ...formData, telefone: formatted });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação básica
        if (!formData.nome) {
            alert("O nome é obrigatório.");
            return;
        }

        // Validação da Prop
        if (!especialidadeId) {
            alert("A especialidade é obrigatória. Selecione-a na tela anterior.");
            return;
        }

        setLoading(true);

        // Construção do Payload estrito conforme solicitado
        const payload = {
            paciente: {
                nome: formData.nome,
                telefone: formData.telefone || "",
                idade: 0,
                nomeResponsavel: "",
                parentescoResponsavel: "",
                observacao: "",
                recebeuAlta: false
            },
            listaEspera: {
                especialidade: parseInt(especialidadeId, 10),
                prioridade: 2
            }
        };

        try {
            const response = await CreatePaciente(payload);

            // Assume que a resposta contém os dados necessários ou usamos os locais
            const novoPaciente = response || {};

            onPacienteCriado({
                id: novoPaciente.pacienteId,
                nome: formData.nome,
                novo: true
            });
        } catch (error) {
            console.error("Erro ao criar paciente", error);
            alert("Erro ao cadastrar paciente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-patient-form">
            <h4>Cadastro Rápido</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome Completo *"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone (opcional)"
                        value={formData.telefone}
                        onChange={handleTelefoneChange}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="button" className="btn-secondary" onClick={onCancelar} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        {loading ? 'Salvando...' : 'Salvar e Selecionar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CriarPacienteAgendamento;