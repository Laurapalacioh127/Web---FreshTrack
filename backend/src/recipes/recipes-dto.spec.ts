import { validate } from 'class-validator';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ModerateRecipeDto } from './dto/moderate-recipe.dto';

describe('Recipes DTO validations', () => {
  it('accepts a valid recipe', async () => {
    const dto = Object.assign(new CreateRecipeDto(), {
      title: 'Arroz con verduras',
      prepTimeMins: 25,
      masterProductIds: [1, 2],
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects an empty ingredient list', async () => {
    const dto = Object.assign(new CreateRecipeDto(), {
      title: 'Arroz',
      prepTimeMins: 15,
      masterProductIds: [],
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'masterProductIds')).toBe(
      true,
    );
  });

  it('rejects duplicate ingredients', async () => {
    const dto = Object.assign(new CreateRecipeDto(), {
      title: 'Ensalada',
      prepTimeMins: 10,
      masterProductIds: [1, 1],
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'masterProductIds')).toBe(
      true,
    );
  });

  it('rejects pending as an admin moderation decision', async () => {
    const dto = Object.assign(new ModerateRecipeDto(), {
      moderationStatus: 'pending',
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });
});
