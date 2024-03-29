import { AppError } from "@shared/errors/AppError";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase"

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it("should be able to create a new car", async () => {
        const car = await createCarUseCase.execute({
            name: "NameCar",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "categoryID"
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a car with exists license plate", async () => {
        await createCarUseCase.execute({
            name: "NameCar 1",
            description: "Description Car 1",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand 1",
            category_id: "categoryID 1"
        });

        await expect(
            createCarUseCase.execute({
                name: "NameCar 2",
                description: "Description Car 2",
                daily_rate: 200,
                license_plate: "ABC-1234",
                fine_amount: 70,
                brand: "Brand 2",
                category_id: "categoryID 2"
            })
        ).rejects.toEqual(new AppError("Car already exists!"));
    });

    it("should not be able to create a car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Car Available",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "categoryID_Available"
        })

        expect(car.available).toBe(true);
    });
});