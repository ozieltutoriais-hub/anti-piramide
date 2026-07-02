from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from robot_ecnh import RoboeCNH

app = FastAPI(title="DETRAN Gateway API", version="1.0.0")
robo = RoboeCNH()

class AlunoSincronizar(BaseModel):
    id_firebase: str
    cpf: str
    nome: str
    tipo_envio: str # ex: 'BCA', 'LADV'

@app.get("/")
def health_check():
    return {"status": "online", "message": "Gateway DETRAN-SP operando."}

@app.post("/sincronizar")
async def sincronizar_aluno(aluno: AlunoSincronizar):
    """
    Endpoint que recebe a chamada do Front-end (React) e dispara o Robô.
    Em produção, este endpoint adicionaria o aluno a uma fila (ex: SQS/RabbitMQ).
    Aqui executamos de forma assíncrona.
    """
    if aluno.tipo_envio == 'BCA':
        resultado = await robo.enviar_bca(aluno.cpf, aluno.nome)
        
        # Aqui, o backend atualizaria o Firebase do aluno com o protocolo e status "Sincronizado"
        
        if resultado["sucesso"]:
            return {"status": "ok", "dados": resultado}
        else:
            raise HTTPException(status_code=400, detail=resultado["mensagem"])
            
    else:
        raise HTTPException(status_code=400, detail="Tipo de envio não suportado ainda pelo Robô.")
