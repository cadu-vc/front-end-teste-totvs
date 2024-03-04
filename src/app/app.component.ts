import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PoMenuItem, PoNotificationService } from '@po-ui/ng-components';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  readonly menus: Array<PoMenuItem> = [
    { label: 'Limpar', action: this.onClick.bind(this) }
  ];
  
  clienteForm: FormGroup;
  clientesDb: any[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private poNotification: PoNotificationService // Injeta o PoNotificationService
    ) {
      this.clienteForm = this.formBuilder.group({
        id: [null],
        nome: [''],
        endereco: [''],
        bairro: [''],
        telefones: this.formBuilder.array([]),
        numeroTelefone: ['']
      });
    }
    
    ngOnInit() {
      this.apiService.buscarClientes().subscribe({
        next: (response) => {
          this.clientesDb = response;
        },
        error: (error) => {
          console.error('Erro ao buscar clientes:', error);
        }
      });
    }
    
    private onClick() {
      window.location.reload();
    }
    
    adicionaTelefone() {
      const numeroTelefone = this.clienteForm.get('numeroTelefone')!.value;
      
      if (!numeroTelefone) {
        this.poNotification.error('Por favor, insira um número de telefone válido.');
        return; 
      }
      
      const telefones = this.clienteForm.get('telefones') as FormArray;
      
      const telefoneExistente = telefones.controls.find(control => {
        const numero = control.get('numero')!.value;
        return numero === numeroTelefone;
      });
      
      const telefoneExistenteDb = this.clientesDb.some(clienteDb => {
        return clienteDb.telefones.some((telefone: any) => {
          return telefone.numero === numeroTelefone;
        });
      });
      
      if (!telefoneExistente) {
        if (!telefoneExistenteDb){
          telefones.push(this.formBuilder.group({
            numero: this.formBuilder.control(numeroTelefone)
          }));
        } else {
          this.poNotification.error('O número de telefone já existe no banco de dados.');
        }
      } else {
        this.poNotification.error('O número de telefone já existe na tabela.');
      }
    }
    
    salvarCliente() {
      const cliente = this.clienteForm.value;
      if (cliente.nome && cliente.endereco && cliente.bairro && cliente.telefones.length > 0) {
        this.apiService.salvarCliente(cliente).pipe(
          tap({
            next: () => {
              this.poNotification.success('Cliente salvo.');
              this.onClick();
            },
            error: (error) => {
              console.error('Erro ao salvar cliente:', error);
            }
          })
          ).subscribe();
        } else {
          this.poNotification.error('Todos os campos são obrigatórios.');
        }
      }
      
      buscarClientes() {
        this.apiService.buscarClientes().subscribe({
          next: (response) => {
            console.log(response);
            this.clientesDb = response; // Armazena os clientes do banco de dados na variável clientesDb
          },
          error: (error) => {
            console.error('Erro ao buscar clientes:', error);
          }
        });
      }
    }
    