import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {


  @ViewChild('movieModal', { static: false }) movieModal: ElementRef;

  username: string = '';
  password: string = '';
  isAuthenticated: boolean = false;
  movies: any[] = [];
  newMovie = { name: '', description: '', imageUrl: '', driveUrl: '' };

  constructor(private modalService: NgbModal, private http: HttpClient) {}

  ngOnInit() {
    this.loadMovies();
  }

  
  openModal() {
    // Abre la modal de agregar película
    this.modalService.open(this.movieModal, { centered: true });
}
  
  openAuthenticationModal(content) {
    // Abre la modal de autenticación
    this.modalService.open(content);
}

authenticate() {
  // Verificar las credenciales
  if (this.username === 'admin' && this.password === 'password') {
      // Credenciales correctas, establece isAuthenticated y abre la modal de agregar película
      this.isAuthenticated = true;
      this.modalService.dismissAll(); // Cierra la modal de autenticación
      this.openModal(); // Utiliza la referencia directa
  } else {
      // Credenciales incorrectas, mostrar mensaje de error
      alert('Usuario o contraseña incorrectos. Intenta de nuevo.');
      // Puedes también reiniciar los campos de usuario y contraseña
      this.username = '';
      this.password = '';
  }
}
  
  loadMovies() {
    this.http.get('http://thebestmoviesweb.000webhostapp.com/get_movies.php').subscribe((data: any) => {
      this.movies = data;
    });
  }
  
  addMovie() {
    // Verificar que todos los campos estén llenos
    if (!this.newMovie.name || !this.newMovie.description || !this.newMovie.imageUrl || !this.newMovie.driveUrl) {
        alert('Todos los campos son obligatorios');
        return;
    }

    // Log para verificar los datos
    console.log('Datos a enviar:', this.newMovie);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post('http://thebestmoviesweb.000webhostapp.com/add_movie.php', this.newMovie, { headers }).subscribe(
        response => {
            console.log(response);
            this.loadMovies();  // Recargar las películas después de agregar una nueva
            this.newMovie = { name: '', description: '', imageUrl: '', driveUrl: '' };
            this.modalService.dismissAll();
        },
        error => {
            console.error('Error al añadir la película:', error);
            alert('Error al añadir la película. Inténtalo de nuevo.');
        }
    );
}


}
