package API.RestFull.Persona;

import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
@CrossOrigin (origins = "http://127.0.0.1:5500")
public class PersonController {

    private final PersonService personService;
    
    
    @PostMapping
    public void createPersona(@RequestBody Person person)
    {
        personService.createPersona(person);
    }

    @GetMapping("/lista")
    public List<Person> listPersona() {
        return personService.listPersona();
    }

    @DeleteMapping("/{id}")
    public void deletePersona(@PathVariable Integer id) {
        personService.deletePersona(id);
    }

    @GetMapping("/{id}")
    public Optional<Person> findPersonaById(@PathVariable Integer id) {
        return personService.findById(id);
    }

    @PutMapping("/{id}")
    public void updatePersona(@PathVariable Integer id, @RequestBody Person updatedPerson) {
        // Busca la persona existente por su ID
        Person existingPerson = personService.findById(id)
            .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));

        // Actualiza los campos de la persona existente con los nuevos valores proporcionados
        existingPerson.setFirstName(updatedPerson.getFirstName());
        existingPerson.setLastName(updatedPerson.getLastName());
        existingPerson.setEmail(updatedPerson.getEmail());

        // Guarda la persona actualizada en la base de datos
        personService.updatePersona(existingPerson);
    }

}