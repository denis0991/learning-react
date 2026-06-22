import { useCallback, type JSX } from "react";
import type { Animals } from "../search/search.interfaces";
import { useSelectionStore } from "../../stores/useSelectionStore";
import { usePrefetchAnimalDetails } from "../../hooks/useAnimalQueries";
import { useSearchParams } from "next/navigation";
import { useRouter } from '../../../i18n/navigation';
import { useTranslations } from 'next-intl';

export function Card({
  uid,
  name,
  avian,
  earthAnimal,
  feline,
}: Animals): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleSelection, isSelected } = useSelectionStore();
  const selected = isSelected(uid);
  const prefetchDetails = usePrefetchAnimalDetails();

  const handleMouseEnter = () => {
    prefetchDetails(uid);
  };

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLUListElement>) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".checkbox-wrapper")) {
        const page = searchParams?.get("page") || "1";
        router.push(`/details/${uid}?page=${page}`);
      }
    },
    [uid, router, searchParams],
  );

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      toggleSelection({
        uid,
        name,
        avian,
        earthAnimal,
        feline,
        json: function (): unknown {
          throw new Error("Function not implemented.");
        },
        earthInsect: false,
        canine: false,
        selectedAt: undefined,
      });
    },
    [avian, earthAnimal, feline, name, toggleSelection, uid],
  );
 const tDetails = useTranslations('details');
const tCommon = useTranslations('common');
const boolVal = (v: boolean) => v ? tCommon('yes') : tCommon('no');

  return (
    <ul className={`card ${selected ? "selected" : ""}`} onClick={handleClick}>
      <li className="card-item checkbox-wrapper">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnter}
            className="card-checkbox"
          />
          <span className="checkbox-custom"></span>
        </label>
      </li>
      <li className="card-item animal-name">{name}</li>
      <li className="card-item">
        {tDetails('properties.avian')}:{" "} <span className="animal-properties">{boolVal(avian)}</span>
      </li>
      <li className="card-item">
        {tDetails('properties.earthAnimal')}:{" "}
        <span className="animal-properties">{boolVal(earthAnimal)}</span>
      </li>
      <li className="card-item">
        {tDetails('properties.feline')}:{" "}
        <span className="animal-properties">{boolVal(feline)}</span>
      </li>
    </ul>
  );
}
